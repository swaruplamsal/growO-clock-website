"""
Models for the careers app.
"""

import uuid

from django.db import models


class JobPosition(models.Model):
    """Job positions."""

    class EmploymentType(models.TextChoices):
        FULL_TIME = 'FULL_TIME', 'Full-time'
        PART_TIME = 'PART_TIME', 'Part-time'
        CONTRACT = 'CONTRACT', 'Contract'
        INTERNSHIP = 'INTERNSHIP', 'Internship'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    department = models.CharField(max_length=100)
    employment_type = models.CharField(
        max_length=15, choices=EmploymentType.choices
    )
    location = models.CharField(max_length=100)
    description = models.TextField()
    requirements = models.TextField()
    salary_range = models.CharField(max_length=100, blank=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'job_positions'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class JobApplication(models.Model):
    """Job applications."""

    class Status(models.TextChoices):
        SUBMITTED = 'SUBMITTED', 'Submitted'
        REVIEWING = 'REVIEWING', 'Under Review'
        SHORTLISTED = 'SHORTLISTED', 'Shortlisted'
        REJECTED = 'REJECTED', 'Rejected'
        HIRED = 'HIRED', 'Hired'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    position = models.ForeignKey(
        JobPosition, on_delete=models.CASCADE, related_name='applications'
    )

    applicant_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    resume = models.FileField(upload_to='resumes/%Y/%m/')
    cover_letter = models.TextField()
    linkedin_url = models.URLField(blank=True)

    status = models.CharField(
        max_length=15, choices=Status.choices, default=Status.SUBMITTED
    )
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'job_applications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.applicant_name} - {self.position.title}"
