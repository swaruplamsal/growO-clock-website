import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings.development')

app = Celery('backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Periodic tasks
app.conf.beat_schedule = {
    'send-consultation-reminders': {
        'task': 'apps.consultations.tasks.send_consultation_reminders',
        'schedule': crontab(minute=0, hour='*/1'),  # Every hour
    },
    'update-portfolio-values': {
        'task': 'apps.investments.tasks.update_portfolio_values',
        'schedule': crontab(minute=0, hour=9),  # Daily at 9 AM
    },
    'cleanup-expired-tokens': {
        'task': 'apps.accounts.tasks.cleanup_expired_tokens',
        'schedule': crontab(minute=0, hour=0),  # Daily at midnight
    },
    'cleanup-old-notifications': {
        'task': 'apps.notifications.tasks.cleanup_old_notifications',
        'schedule': crontab(minute=0, hour=1),  # Daily at 1 AM
    },
}


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
