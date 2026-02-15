"""
Views for the accounts app.
"""

import uuid
from datetime import timedelta

from django.contrib.auth import logout
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import User, UserProfile, UserPreferences
from .serializers import (
    UserRegistrationSerializer,
    LoginSerializer,
    UserDetailSerializer,
    UserSerializer,
    UserProfileSerializer,
    UserPreferencesSerializer,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
    EmailVerificationSerializer,
    AvatarUploadSerializer,
    AdminUserSerializer,
)
from .tasks import send_verification_email_task, send_password_reset_email_task
from utils.permissions import IsOwnerOrAdmin, IsAdminUser


def get_tokens_for_user(user):
    """Generate JWT tokens for a user."""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# ──────────────────── Auth Views ────────────────────

@extend_schema(tags=['Auth'])
class RegisterView(generics.CreateAPIView):
    """Register a new user account."""
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'register'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate verification token
        token = str(uuid.uuid4())
        user.email_verification_token = token
        user.save(update_fields=['email_verification_token'])

        # Send verification email
        send_verification_email_task.delay(str(user.id), token)

        tokens = get_tokens_for_user(user)
        return Response(
            {
                'success': True,
                'message': 'Registration successful. Please verify your email.',
                'data': {
                    'user': UserSerializer(user).data,
                    'tokens': tokens,
                },
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema(tags=['Auth'])
class LoginView(APIView):
    """Authenticate user and return JWT tokens."""
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer
    throttle_scope = 'login'

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        tokens = get_tokens_for_user(user)
        return Response(
            {
                'success': True,
                'message': 'Login successful.',
                'data': {
                    'user': UserDetailSerializer(user).data,
                    'tokens': tokens,
                },
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=['Auth'],
    request={'application/json': {'type': 'object', 'properties': {'refresh': {'type': 'string'}}}},
    responses={200: dict}
)
class LogoutView(APIView):
    """Logout user by blacklisting the refresh token."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response(
                {'success': True, 'message': 'Logged out successfully.'},
                status=status.HTTP_200_OK,
            )
        except Exception:
            return Response(
                {'success': False, 'message': 'Invalid token.'},
                status=status.HTTP_400_BAD_REQUEST,
            )


@extend_schema(tags=['Auth'])
class CustomTokenRefreshView(TokenRefreshView):
    """Refresh an access token."""
    pass


@extend_schema(tags=['Auth'])
class VerifyEmailView(APIView):
    """Verify user email with token."""
    permission_classes = [permissions.AllowAny]
    serializer_class = EmailVerificationSerializer

    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data['token']
        try:
            user = User.objects.get(email_verification_token=token)
            user.is_verified = True
            user.email_verification_token = ''
            user.save(update_fields=['is_verified', 'email_verification_token'])
            return Response(
                {'success': True, 'message': 'Email verified successfully.'},
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {'success': False, 'message': 'Invalid or expired verification token.'},
                status=status.HTTP_400_BAD_REQUEST,
            )


@extend_schema(
    tags=['Auth'],
    request=None,
    responses={200: dict}
)
class ResendVerificationView(APIView):
    """Resend email verification link."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.is_verified:
            return Response(
                {'success': False, 'message': 'Email is already verified.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token = str(uuid.uuid4())
        user.email_verification_token = token
        user.save(update_fields=['email_verification_token'])

        send_verification_email_task.delay(str(user.id), token)
        return Response(
            {'success': True, 'message': 'Verification email sent.'},
            status=status.HTTP_200_OK,
        )


@extend_schema(tags=['Auth'])
class ForgotPasswordView(APIView):
    """Request a password reset link."""
    permission_classes = [permissions.AllowAny]
    serializer_class = ForgotPasswordSerializer
    throttle_scope = 'password_reset'

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            token = str(uuid.uuid4())
            user.password_reset_token = token
            user.password_reset_expires = timezone.now() + timedelta(hours=1)
            user.save(update_fields=['password_reset_token', 'password_reset_expires'])
            send_password_reset_email_task.delay(str(user.id), token)
        except User.DoesNotExist:
            pass  # Don't reveal whether email exists

        return Response(
            {
                'success': True,
                'message': 'If an account with that email exists, a reset link has been sent.',
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(tags=['Auth'])
class ResetPasswordView(APIView):
    """Reset password using the token from email."""
    permission_classes = [permissions.AllowAny]
    serializer_class = ResetPasswordSerializer

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            user = User.objects.get(
                password_reset_token=token,
                password_reset_expires__gt=timezone.now(),
            )
            user.set_password(new_password)
            user.password_reset_token = ''
            user.password_reset_expires = None
            user.save(update_fields=['password', 'password_reset_token', 'password_reset_expires'])
            return Response(
                {'success': True, 'message': 'Password reset successful.'},
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {'success': False, 'message': 'Invalid or expired reset token.'},
                status=status.HTTP_400_BAD_REQUEST,
            )


# ──────────────────── User Views ────────────────────

@extend_schema(tags=['Users'])
class UserMeView(generics.RetrieveUpdateAPIView):
    """Get or update the current user's profile."""
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


@extend_schema(tags=['Users'])
class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get or update the current user's extended profile."""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


@extend_schema(tags=['Users'])
class UserPreferencesView(generics.RetrieveUpdateAPIView):
    """Get or update user preferences."""
    serializer_class = UserPreferencesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        prefs, _ = UserPreferences.objects.get_or_create(user=self.request.user)
        return prefs


@extend_schema(tags=['Users'])
class ChangePasswordView(APIView):
    """Change current user's password."""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def put(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)

        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save(update_fields=['password'])
        return Response(
            {'success': True, 'message': 'Password changed successfully.'},
            status=status.HTTP_200_OK,
        )


@extend_schema(tags=['Users'])
class AvatarUploadView(APIView):
    """Upload or update user avatar."""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = AvatarUploadSerializer

    def patch(self, request):
        serializer = AvatarUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        # Delete old avatar if exists
        if profile.avatar:
            profile.avatar.delete(save=False)
        profile.avatar = serializer.validated_data['avatar']
        profile.save(update_fields=['avatar'])

        return Response(
            {
                'success': True,
                'message': 'Avatar updated successfully.',
                'data': {'avatar_url': request.build_absolute_uri(profile.avatar.url)},
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(tags=['Users'])
class DeleteAccountView(APIView):
    """Delete the current user's account."""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.is_active = False
        user.save(update_fields=['is_active'])
        return Response(
            {'success': True, 'message': 'Account deactivated successfully.'},
            status=status.HTTP_200_OK,
        )


# ──────────────────── Admin Views ────────────────────

@extend_schema(tags=['Admin'])
class AdminUserListView(generics.ListAPIView):
    """List all users (admin only)."""
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    filterset_fields = ['role', 'is_active', 'is_verified']
    search_fields = ['email', 'full_name']
    ordering_fields = ['created_at', 'email', 'full_name']


@extend_schema(tags=['Admin'])
class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a user (admin only)."""
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    lookup_field = 'id'
