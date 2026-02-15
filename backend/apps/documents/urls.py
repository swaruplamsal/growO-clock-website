"""
URL configuration for the documents app.
"""

from django.urls import path
from . import views

app_name = 'documents'

urlpatterns = [
    path('', views.DocumentListView.as_view(), name='document-list'),
    path('upload/', views.DocumentUploadView.as_view(), name='document-upload'),
    path('<uuid:id>/', views.DocumentDetailView.as_view(), name='document-detail'),
    path('<uuid:id>/download/', views.DocumentDownloadView.as_view(), name='document-download'),
    path('<uuid:id>/share/', views.DocumentShareView.as_view(), name='document-share'),
]
