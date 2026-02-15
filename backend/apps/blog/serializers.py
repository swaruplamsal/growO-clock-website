"""
Serializers for the blog app.
"""

from rest_framework import serializers
from .models import BlogPost, Category, Tag


class CategorySerializer(serializers.ModelSerializer):
    posts_count = serializers.IntegerField(source='posts.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'posts_count']


class TagSerializer(serializers.ModelSerializer):
    posts_count = serializers.IntegerField(source='posts.count', read_only=True)

    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'posts_count']


class BlogPostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for blog post listing."""
    author_name = serializers.CharField(source='author.full_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'author_name',
            'category', 'category_name', 'tags', 'featured_image',
            'status', 'read_time', 'views', 'is_featured',
            'published_at', 'created_at',
        ]


class BlogPostDetailSerializer(serializers.ModelSerializer):
    """Full serializer for blog post detail."""
    author_name = serializers.CharField(source='author.full_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content',
            'author', 'author_name', 'category', 'category_name',
            'tags', 'featured_image', 'status', 'read_time', 'views',
            'is_featured', 'published_at', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'author', 'views', 'created_at', 'updated_at']


class BlogPostCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating blog posts (admin/advisor)."""
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Tag.objects.all(), write_only=True, required=False
    )

    class Meta:
        model = BlogPost
        fields = [
            'title', 'slug', 'excerpt', 'content', 'category',
            'tag_ids', 'featured_image', 'status', 'is_featured', 'published_at',
        ]

    def create(self, validated_data):
        tags = validated_data.pop('tag_ids', [])
        validated_data['author'] = self.context['request'].user

        # Auto-set published_at when status is PUBLISHED
        from django.utils import timezone
        if validated_data.get('status') == BlogPost.Status.PUBLISHED and not validated_data.get('published_at'):
            validated_data['published_at'] = timezone.now()

        post = super().create(validated_data)
        if tags:
            post.tags.set(tags)
        return post

    def update(self, instance, validated_data):
        tags = validated_data.pop('tag_ids', None)

        from django.utils import timezone
        if validated_data.get('status') == BlogPost.Status.PUBLISHED and not instance.published_at:
            validated_data['published_at'] = timezone.now()

        post = super().update(instance, validated_data)
        if tags is not None:
            post.tags.set(tags)
        return post
