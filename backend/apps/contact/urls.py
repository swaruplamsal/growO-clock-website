"""
URL patterns for the contact app.
"""

from django.urls import path
from .views import (
    ContactSubmitView,
    ContactMessageListView,
    ContactMessageDetailView,
    ContactRespondView,
)

app_name = 'contact'

urlpatterns = [
    path('', ContactSubmitView.as_view(), name='contact-submit'),
    path('messages/', ContactMessageListView.as_view(), name='contact-admin-list'),
    path('messages/<uuid:id>/', ContactMessageDetailView.as_view(), name='contact-detail'),
    path('messages/<uuid:id>/respond/', ContactRespondView.as_view(), name='contact-respond'),
]
