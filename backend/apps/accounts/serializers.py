"""
Serializers for the accounts app.
"""

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, UserProfile, UserPreferences


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(
        write_only=True, min_length=8, validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'full_name', 'phone', 'password', 'password_confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {'password_confirm': 'Passwords do not match.'}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email', '').lower()
        password = attrs.get('password')

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError(
                'Invalid email or password.'
            )
        if not user.is_active:
            raise serializers.ValidationError(
                'This account has been deactivated.'
            )
        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details."""

    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'phone', 'role',
            'is_verified', 'is_active', 'created_at', 'updated_at', 'last_login',
        ]
        read_only_fields = ['id', 'email', 'role', 'is_verified', 'created_at', 'updated_at', 'last_login']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""

    class Meta:
        model = UserProfile
        fields = [
            'date_of_birth', 'avatar', 'address', 'city', 'country',
            'occupation', 'annual_income', 'risk_tolerance', 'bio',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class UserPreferencesSerializer(serializers.ModelSerializer):
    """Serializer for user preferences."""

    class Meta:
        model = UserPreferences
        fields = [
            'currency', 'email_notifications', 'sms_notifications',
            'push_notifications', 'dark_mode', 'language',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class UserDetailSerializer(serializers.ModelSerializer):
    """Full user detail serializer with profile and preferences."""
    profile = UserProfileSerializer(read_only=True)
    preferences = UserPreferencesSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'phone', 'role',
            'is_verified', 'is_active', 'created_at', 'updated_at',
            'last_login', 'profile', 'preferences',
        ]
        read_only_fields = ['id', 'email', 'role', 'is_verified', 'created_at', 'updated_at', 'last_login']


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password."""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True, min_length=8, validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(required=True, min_length=8)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError(
                {'new_password_confirm': 'New passwords do not match.'}
            )
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect.')
        return value


class ForgotPasswordSerializer(serializers.Serializer):
    """Serializer for forgot password request."""
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    """Serializer for resetting password with token."""
    token = serializers.CharField()
    new_password = serializers.CharField(
        min_length=8, validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(min_length=8)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError(
                {'new_password_confirm': 'Passwords do not match.'}
            )
        return attrs


class EmailVerificationSerializer(serializers.Serializer):
    """Serializer for email verification."""
    token = serializers.CharField()


class AvatarUploadSerializer(serializers.Serializer):
    """Serializer for avatar upload."""
    avatar = serializers.ImageField()

    def validate_avatar(self, value):
        # Max 2MB for avatars
        if value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError('Avatar image must be less than 2MB.')
        return value


class AdminUserSerializer(serializers.ModelSerializer):
    """Serializer for admin user management."""
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'phone', 'role',
            'is_verified', 'is_active', 'is_staff',
            'created_at', 'updated_at', 'last_login', 'profile',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_login']
