"""
Celery tasks for the notifications app.
"""

from celery import shared_task
from django.utils import timezone
from datetime import timedelta


@shared_task(name='notifications.send_notification')
def send_notification(user_id, title, message, notification_type='SYSTEM', priority='MEDIUM', data=None, action_url=''):
    """Create a notification and send via WebSocket."""
    from .models import Notification
    from apps.accounts.models import User

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return

    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        priority=priority,
        data=data,
        action_url=action_url,
    )

    # Send via WebSocket
    try:
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notifications_{user_id}',
            {
                'type': 'notification_message',
                'notification': {
                    'id': str(notification.id),
                    'title': notification.title,
                    'message': notification.message,
                    'notification_type': notification.notification_type,
                    'priority': notification.priority,
                    'action_url': notification.action_url,
                    'created_at': notification.created_at.isoformat(),
                },
            },
        )
    except Exception:
        # WebSocket delivery is best-effort
        pass

    return str(notification.id)


@shared_task(name='notifications.cleanup_old_notifications')
def cleanup_old_notifications():
    """Delete read notifications older than 30 days."""
    from .models import Notification

    cutoff = timezone.now() - timedelta(days=30)
    deleted_count, _ = Notification.objects.filter(
        is_read=True, created_at__lt=cutoff
    ).delete()

    return f'Deleted {deleted_count} old notifications.'


@shared_task(name='notifications.send_bulk_notification')
def send_bulk_notification(user_ids, title, message, notification_type='SYSTEM', priority='MEDIUM'):
    """Send the same notification to multiple users."""
    for user_id in user_ids:
        send_notification.delay(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type,
            priority=priority,
        )
