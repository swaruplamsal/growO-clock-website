"""
Celery tasks for the consultations app.
"""

from celery import shared_task
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


@shared_task
def send_consultation_reminders():
    """Send reminder emails for consultations scheduled in the next 24 hours."""
    from .models import Consultation
    from utils.email import send_consultation_reminder_email

    tomorrow = timezone.now() + timedelta(hours=24)
    upcoming = Consultation.objects.filter(
        status=Consultation.Status.SCHEDULED,
        scheduled_date__range=(timezone.now(), tomorrow),
    )

    count = 0
    for consultation in upcoming:
        try:
            send_consultation_reminder_email(consultation)
            count += 1
        except Exception as e:
            logger.error(f'Failed to send reminder for consultation {consultation.id}: {e}')

    logger.info(f'Sent {count} consultation reminder emails')
    return count
