"""
Views for the blog app.
"""

from django.db.models import F
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .models import BlogPost, Category, Tag
from .serializers import (
    BlogPostListSerializer,
    BlogPostDetailSerializer,
    BlogPostCreateSerializer,
    CategorySerializer,
    TagSerializer,
)
from utils.permissions import IsAdminUser, IsAdvisor


@extend_schema(tags=['Blog'])
class BlogPostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for blog posts.

    Public: list and retrieve published posts.
    Admin/Advisor: create, update, delete posts.
    """
    filterset_fields = ['category__slug', 'status', 'is_featured']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at', 'views', 'created_at']
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ('list', 'retrieve', 'increment_view'):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdvisor()]

    def get_serializer_class(self):
        if self.action == 'list':
            return BlogPostListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return BlogPostCreateSerializer
        return BlogPostDetailSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and (user.is_staff or user.role in ('ADMIN', 'ADVISOR')):
            return BlogPost.objects.all().select_related('author', 'category').prefetch_related('tags')
        return BlogPost.objects.filter(
            status=BlogPost.Status.PUBLISHED
        ).select_related('author', 'category').prefetch_related('tags')

    @action(detail=True, methods=['post'], url_path='view')
    def increment_view(self, request, slug=None):
        """Increment the view count for a post."""
        post = self.get_object()
        BlogPost.objects.filter(pk=post.pk).update(views=F('views') + 1)
        return Response({'success': True, 'message': 'View counted.'})


@extend_schema(tags=['Blog'])
class CategoryListView(generics.ListCreateAPIView):
    """List or create blog categories."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminUser()]


@extend_schema(tags=['Blog'])
class TagListView(generics.ListCreateAPIView):
    """List or create blog tags."""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminUser()]
