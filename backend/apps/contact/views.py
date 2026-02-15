"""
Views for the contact app.
"""

from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .models import ContactMessage
from .serializers import (
    ContactMessageCreateSerializer,
    ContactMessageSerializer,
    ContactResponseSerializer,
)
from .tasks import send_contact_notification_task, send_contact_response_task
from utils.permissions import IsAdminUser


@extend_schema(tags=['Contact'])
class ContactSubmitView(generics.CreateAPIView):
    """Submit a contact form message (public)."""
    serializer_class = ContactMessageCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save()

        # Send notification to admin
        send_contact_notification_task.delay(str(message.id))

        return Response(
            {
                'success': True,
                'message': 'Your message has been sent. We will get back to you soon!',
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema(tags=['Contact'])
class ContactMessageListView(generics.ListAPIView):
    """List all contact messages (admin only)."""
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminUser]
    queryset = ContactMessage.objects.all()
    filterset_fields = ['status']
    search_fields = ['name', 'email', 'subject', 'message']
    ordering_fields = ['created_at', 'status']


@extend_schema(tags=['Contact'])
class ContactMessageDetailView(generics.RetrieveUpdateAPIView):
    """Get or update a contact message (admin only)."""
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminUser]
    queryset = ContactMessage.objects.all()
    lookup_field = 'id'

    def perform_update(self, serializer):
        # Mark as read when accessed
        instance = serializer.save()
        if instance.status == ContactMessage.Status.NEW:
            instance.status = ContactMessage.Status.READ
            instance.save(update_fields=['status'])


@extend_schema(tags=['Contact'])
class ContactRespondView(APIView):
    """Respond to a contact message (admin only)."""
    permission_classes = [IsAdminUser]
    serializer_class = ContactResponseSerializer

    def post(self, request, id):
        try:
            message = ContactMessage.objects.get(id=id)
        except ContactMessage.DoesNotExist:
            return Response(
                {'success': False, 'message': 'Message not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ContactResponseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message.response = serializer.validated_data['response']
        message.responded_by = request.user
        message.responded_at = timezone.now()
        message.status = ContactMessage.Status.RESPONDED
        message.save()

        # Send response email
        send_contact_response_task.delay(str(message.id))

        return Response(
            {'success': True, 'message': 'Response sent successfully.'},
            status=status.HTTP_200_OK,
        )
