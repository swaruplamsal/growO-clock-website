"""
Custom permission classes.
"""

from rest_framework.permissions import BasePermission


class IsOwnerOrAdmin(BasePermission):
    """Allow access only to object owner or admin users."""

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.role == 'ADMIN':
            return True
        # Check for 'user' attribute first, then fall back to checking the object itself
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user


class IsAdvisor(BasePermission):
    """Allow access only to advisors and admins."""

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in ('ADVISOR', 'ADMIN')
        )


class IsAdminUser(BasePermission):
    """Allow access only to admin users."""

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (request.user.is_staff or request.user.role == 'ADMIN')
        )


class IsVerified(BasePermission):
    """Allow access only to verified users."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_verified


class IsOwner(BasePermission):
    """Allow access only to the object owner."""

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user


class ReadOnly(BasePermission):
    """Allow read-only access."""

    def has_permission(self, request, view):
        return request.method in ('GET', 'HEAD', 'OPTIONS')
