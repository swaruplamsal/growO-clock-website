"""
URL patterns for the blog app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, CategoryListView, TagListView

app_name = 'blog'

router = DefaultRouter()
router.register('posts', BlogPostViewSet, basename='blog-post')

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='blog-categories'),
    path('tags/', TagListView.as_view(), name='blog-tags'),
] + router.urls
