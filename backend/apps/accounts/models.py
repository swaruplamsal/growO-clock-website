"""
Custom User model and related profile models.
"""

import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    """Custom user manager using email as the unique identifier."""

    def create_user(self, email, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        if not full_name:
            raise ValueError('Users must have a full name')

        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)
        extra_fields.setdefault('role', User.UserRole.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, full_name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom User Model using email as the primary identifier."""

    class UserRole(models.TextChoices):
        USER = 'USER', 'User'
        ADVISOR = 'ADVISOR', 'Advisor'
        ADMIN = 'ADMIN', 'Admin'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True)

    role = models.CharField(
        max_length=10, choices=UserRole.choices, default=UserRole.USER
    )

    # Verification
    is_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=255, blank=True)

    # Password reset
    password_reset_token = models.CharField(max_length=255, blank=True)
    password_reset_expires = models.DateTimeField(null=True, blank=True)

    # Status
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']

    def __str__(self):
        return self.email

    @property
    def first_name(self):
        return self.full_name.split(' ')[0] if self.full_name else ''

    @property
    def is_admin(self):
        return self.role == self.UserRole.ADMIN or self.is_superuser

    @property
    def is_advisor(self):
        return self.role == self.UserRole.ADVISOR


class UserProfile(models.Model):
    """Extended user profile information."""

    class RiskTolerance(models.TextChoices):
        CONSERVATIVE = 'CONSERVATIVE', 'Conservative'
        MODERATE = 'MODERATE', 'Moderate'
        AGGRESSIVE = 'AGGRESSIVE', 'Aggressive'

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile'
    )
    date_of_birth = models.DateField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    occupation = models.CharField(max_length=100, blank=True)
    annual_income = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    risk_tolerance = models.CharField(
        max_length=15, choices=RiskTolerance.choices, blank=True
    )
    bio = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_profiles'

    def __str__(self):
        return f"{self.user.email}'s profile"


class UserPreferences(models.Model):
    """User notification and display preferences."""

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='preferences'
    )
    currency = models.CharField(max_length=3, default='NPR')

    # Notification preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    push_notifications = models.BooleanField(default=True)

    # Display preferences
    dark_mode = models.BooleanField(default=False)
    language = models.CharField(max_length=5, default='en')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_preferences'
        verbose_name_plural = 'User preferences'

    def __str__(self):
        return f"{self.user.email}'s preferences"
