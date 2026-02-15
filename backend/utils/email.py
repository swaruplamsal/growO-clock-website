"""
Email utility functions.
"""

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import logging

logger = logging.getLogger(__name__)


def send_templated_email(subject, template_name, context, recipient_list, from_email=None):
    """
    Send an HTML email using a template.

    Args:
        subject: Email subject
        template_name: Path to HTML email template
        context: Template context dictionary
        recipient_list: List of recipient email addresses
        from_email: Sender email (defaults to DEFAULT_FROM_EMAIL)
    """
    from_email = from_email or settings.DEFAULT_FROM_EMAIL
    context.setdefault('frontend_url', settings.FRONTEND_URL)
    context.setdefault('company_name', "grow O'Clock")

    try:
        html_content = render_to_string(template_name, context)
        text_content = strip_tags(html_content)

        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=from_email,
            to=recipient_list,
        )
        msg.attach_alternative(html_content, 'text/html')
        msg.send()
        logger.info(f'Email sent successfully to {recipient_list}')
        return True
    except Exception as e:
        logger.error(f'Failed to send email to {recipient_list}: {e}')
        return False


def send_welcome_email(user):
    """Send welcome email to newly registered user."""
    return send_templated_email(
        subject="Welcome to grow O'Clock!",
        template_name='emails/welcome.html',
        context={'user': user},
        recipient_list=[user.email],
    )


def send_verification_email(user, token):
    """Send email verification link."""
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    return send_templated_email(
        subject='Verify your email address',
        template_name='emails/verification.html',
        context={'user': user, 'verification_url': verification_url},
        recipient_list=[user.email],
    )


def send_password_reset_email(user, token):
    """Send password reset link."""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    return send_templated_email(
        subject='Reset your password',
        template_name='emails/password_reset.html',
        context={'user': user, 'reset_url': reset_url},
        recipient_list=[user.email],
    )


def send_consultation_reminder_email(consultation):
    """Send consultation reminder email 24 hours before."""
    return send_templated_email(
        subject=f'Reminder: Your consultation is tomorrow',
        template_name='emails/consultation_reminder.html',
        context={'consultation': consultation, 'user': consultation.user},
        recipient_list=[consultation.user.email],
    )


def send_contact_response_email(contact_message, response_text):
    """Send response to a contact message."""
    return send_templated_email(
        subject=f"Re: {contact_message.subject}",
        template_name='emails/contact_response.html',
        context={
            'name': contact_message.name,
            'original_message': contact_message.message,
            'response': response_text,
        },
        recipient_list=[contact_message.email],
    )
