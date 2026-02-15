"""
Tests for the blog app.
"""

import pytest
from django.urls import reverse
from rest_framework import status
from apps.blog.models import BlogPost, Category, Tag


@pytest.mark.django_db
class TestBlogModels:
    """Tests for blog models."""

    def test_create_category(self):
        category = Category.objects.create(
            name='Finance', slug='finance',
        )
        assert str(category) == 'Finance'

    def test_create_tag(self):
        tag = Tag.objects.create(name='Investment')
        assert tag.slug == 'investment'

    def test_create_blog_post(self, admin_user):
        category = Category.objects.create(name='Tips', slug='tips')
        post = BlogPost.objects.create(
            title='Test Post',
            slug='test-post',
            content='This is a test blog post with enough content for reading time.',
            author=admin_user,
            category=category,
            status='PUBLISHED',
        )
        assert post.read_time >= 1
        assert str(post) == 'Test Post'


@pytest.mark.django_db
class TestBlogAPI:
    """Tests for blog API endpoints."""

    def test_list_published_posts(self, api_client, admin_user):
        category = Category.objects.create(name='General', slug='general')
        BlogPost.objects.create(
            title='Published Post',
            slug='published-post',
            content='Content',
            author=admin_user,
            category=category,
            status='PUBLISHED',
        )
        BlogPost.objects.create(
            title='Draft Post',
            slug='draft-post',
            content='Content',
            author=admin_user,
            category=category,
            status='DRAFT',
        )
        url = reverse('blog:post-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        # Only published posts should be visible to public
        assert len(response.data['results']) == 1

    def test_list_categories(self, api_client):
        Category.objects.create(name='Cat1', slug='cat1')
        url = reverse('blog:category-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
