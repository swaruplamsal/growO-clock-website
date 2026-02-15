"""
Custom validators for the API.
"""

import re
from django.core.exceptions import ValidationError
from django.conf import settings


def validate_phone_number(value):
    """Validate phone number format (international)."""
    pattern = r'^\+?[\d\s\-\(\)]{7,20}$'
    if not re.match(pattern, value):
        raise ValidationError(
            'Enter a valid phone number (e.g., +977-9800000000).'
        )


def validate_file_extension(value):
    """Validate file upload extension."""
    import os
    ext = os.path.splitext(value.name)[1].lower()
    allowed = getattr(settings, 'ALLOWED_UPLOAD_EXTENSIONS',
                      ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.xlsx', '.csv'])
    if ext not in allowed:
        raise ValidationError(
            f'File extension "{ext}" is not allowed. Allowed: {", ".join(allowed)}'
        )


def validate_file_size(value):
    """Validate file upload size."""
    max_size = getattr(settings, 'MAX_UPLOAD_SIZE', 5242880)  # 5MB default
    if value.size > max_size:
        raise ValidationError(
            f'File size ({value.size / (1024*1024):.1f}MB) exceeds maximum '
            f'allowed size ({max_size / (1024*1024):.1f}MB).'
        )


def validate_image_file(value):
    """Validate image file type."""
    import os
    ext = os.path.splitext(value.name)[1].lower()
    allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    if ext not in allowed:
        raise ValidationError(
            f'Image extension "{ext}" is not allowed. Allowed: {", ".join(allowed)}'
        )


def validate_future_date(value):
    """Validate that a date is in the future."""
    from django.utils import timezone
    if value <= timezone.now().date():
        raise ValidationError('Date must be in the future.')


def validate_positive_amount(value):
    """Validate that a decimal amount is positive."""
    if value <= 0:
        raise ValidationError('Amount must be positive.')


def validate_percentage(value):
    """Validate percentage value (0-100)."""
    if value < 0 or value > 100:
        raise ValidationError('Percentage must be between 0 and 100.')
