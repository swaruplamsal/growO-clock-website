"""
Celery tasks for the accounts app.
"""

from celery import shared_task
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_verification_email_task(self, user_id, token):
    """Send email verification link asynchronously."""
    try:
        from .models import User
        from utils.email import send_verification_email
        user = User.objects.get(id=user_id)
        send_verification_email(user, token)
        logger.info(f'Verification email sent to {user.email}')
    except Exception as exc:
        logger.error(f'Failed to send verification email: {exc}')
        self.retry(exc=exc, countdown=60)


@shared_task(bind=True, max_retries=3)
def send_password_reset_email_task(self, user_id, token):
    """Send password reset email asynchronously."""
    try:
        from .models import User
        from utils.email import send_password_reset_email
        user = User.objects.get(id=user_id)
        send_password_reset_email(user, token)
        logger.info(f'Password reset email sent to {user.email}')
    except Exception as exc:
        logger.error(f'Failed to send password reset email: {exc}')
        self.retry(exc=exc, countdown=60)


@shared_task
def send_welcome_email_task(user_id):
    """Send welcome email asynchronously."""
    try:
        from .models import User
        from utils.email import send_welcome_email
        user = User.objects.get(id=user_id)
        send_welcome_email(user)
        logger.info(f'Welcome email sent to {user.email}')
    except Exception as exc:
        logger.error(f'Failed to send welcome email: {exc}')


@shared_task
def cleanup_expired_tokens():
    """Clean up expired password reset tokens."""
    from .models import User
    expired = User.objects.filter(
        password_reset_expires__lt=timezone.now(),
        password_reset_token__gt='',
    )
    count = expired.update(password_reset_token='', password_reset_expires=None)
    logger.info(f'Cleaned up {count} expired password reset tokens')
