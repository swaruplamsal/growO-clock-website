"""
Celery tasks for the contact app.
"""

from celery import shared_task
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_contact_notification_task(self, message_id):
    """Notify admins about new contact form submission."""
    try:
        from .models import ContactMessage
        from utils.email import send_templated_email
        from apps.accounts.models import User

        message = ContactMessage.objects.get(id=message_id)
        admin_emails = list(
            User.objects.filter(role='ADMIN', is_active=True).values_list('email', flat=True)
        )

        if admin_emails:
            send_templated_email(
                subject=f'New Contact Message: {message.subject}',
                template_name='emails/contact_notification.html',
                context={'message': message},
                recipient_list=admin_emails,
            )
            logger.info(f'Contact notification sent to {len(admin_emails)} admins')
    except Exception as exc:
        logger.error(f'Failed to send contact notification: {exc}')
        self.retry(exc=exc, countdown=60)


@shared_task(bind=True, max_retries=3)
def send_contact_response_task(self, message_id):
    """Send response email to contact form submitter."""
    try:
        from .models import ContactMessage
        from utils.email import send_contact_response_email

        message = ContactMessage.objects.get(id=message_id)
        send_contact_response_email(message, message.response)
        logger.info(f'Contact response sent to {message.email}')
    except Exception as exc:
        logger.error(f'Failed to send contact response: {exc}')
        self.retry(exc=exc, countdown=60)
