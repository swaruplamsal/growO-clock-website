"""
Admin interface for the blog app.
"""

from django.contrib import admin
from .models import BlogPost, Category, Tag


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'status', 'views', 'is_featured',
                    'published_at', 'created_at']
    list_filter = ['status', 'category', 'is_featured', 'published_at']
    search_fields = ['title', 'excerpt', 'content']
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ['author']
    readonly_fields = ['views', 'created_at', 'updated_at']
    filter_horizontal = ['tags']
    date_hierarchy = 'published_at'
