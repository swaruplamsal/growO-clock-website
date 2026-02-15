"""
Models for the blog app.
"""

import uuid

from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """Blog categories."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        db_table = 'blog_categories'
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Tag(models.Model):
    """Blog tags."""
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)

    class Meta:
        db_table = 'blog_tags'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class BlogPost(models.Model):
    """Blog post model."""

    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PUBLISHED = 'PUBLISHED', 'Published'
        ARCHIVED = 'ARCHIVED', 'Archived'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blog_posts'
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    excerpt = models.TextField(max_length=500)
    content = models.TextField()

    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name='posts'
    )
    tags = models.ManyToManyField(Tag, related_name='posts', blank=True)

    featured_image = models.ImageField(upload_to='blog/%Y/%m/', blank=True)

    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.DRAFT
    )

    read_time = models.IntegerField(default=5, help_text='Read time in minutes')
    views = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)

    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'blog_posts'
        ordering = ['-published_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        # Auto-calculate read time based on content (~200 words per minute)
        if self.content:
            word_count = len(self.content.split())
            self.read_time = max(1, round(word_count / 200))
        super().save(*args, **kwargs)
