"""
Custom permissions for the accounts app.
"""

from rest_framework.permissions import BasePermission


class IsAccountOwner(BasePermission):
    """Only the account owner can access this resource."""

    def has_object_permission(self, request, view, obj):
        return obj == request.user or obj.user == request.user
