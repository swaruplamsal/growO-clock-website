"""
Views for the notifications app.
"""

from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .models import Notification
from .serializers import NotificationSerializer


@extend_schema(tags=['Notifications'])
class NotificationListView(generics.ListAPIView):
    """List user's notifications."""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['notification_type', 'is_read', 'priority']
    ordering_fields = ['created_at', 'priority']

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


@extend_schema(tags=['Notifications'])
class NotificationDetailView(generics.RetrieveAPIView):
    """Get notification detail."""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


@extend_schema(tags=['Notifications'])
class NotificationMarkReadView(APIView):
    """Mark a notification as read."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        try:
            notification = Notification.objects.get(id=id, user=request.user)
        except Notification.DoesNotExist:
            return Response(
                {'success': False, 'message': 'Notification not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        notification.mark_as_read()
        return Response(
            {'success': True, 'message': 'Notification marked as read.'},
            status=status.HTTP_200_OK,
        )


@extend_schema(tags=['Notifications'])
class NotificationMarkAllReadView(APIView):
    """Mark all notifications as read."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        count = Notification.objects.filter(
            user=request.user, is_read=False
        ).update(is_read=True, read_at=timezone.now())
        return Response(
            {'success': True, 'message': f'{count} notification(s) marked as read.'},
            status=status.HTTP_200_OK,
        )


@extend_schema(tags=['Notifications'])
class NotificationDeleteView(generics.DestroyAPIView):
    """Delete a notification."""
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            {'success': True, 'message': 'Notification deleted.'},
            status=status.HTTP_204_NO_CONTENT,
        )


@extend_schema(tags=['Notifications'])
class UnreadCountView(APIView):
    """Get unread notification count."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(
            user=request.user, is_read=False
        ).count()
        return Response(
            {'success': True, 'data': {'unread_count': count}},
            status=status.HTTP_200_OK,
        )
