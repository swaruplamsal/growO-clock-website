"""
Views for the documents app.
"""

from django.http import FileResponse
from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .models import Document
from .serializers import (
    DocumentSerializer,
    DocumentUploadSerializer,
    DocumentShareSerializer,
)
from utils.permissions import IsOwnerOrAdmin


@extend_schema(tags=['Documents'])
class DocumentListView(generics.ListAPIView):
    """List user's documents."""
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['category']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'ADMIN':
            return Document.objects.all()
        from django.db.models import Q
        return Document.objects.filter(
            Q(user=user) | Q(shared_with=user)
        ).distinct()


@extend_schema(tags=['Documents'])
class DocumentUploadView(generics.CreateAPIView):
    """Upload a new document."""
    serializer_class = DocumentUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        doc = serializer.save()
        return Response(
            {
                'success': True,
                'message': 'Document uploaded successfully.',
                'data': DocumentSerializer(doc).data,
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema(tags=['Documents'])
class DocumentDetailView(generics.RetrieveDestroyAPIView):
    """Get or delete a document."""
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'ADMIN':
            return Document.objects.all()
        from django.db.models import Q
        return Document.objects.filter(
            Q(user=user) | Q(shared_with=user)
        ).distinct()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.file.delete(save=False)
        instance.delete()
        return Response(
            {'success': True, 'message': 'Document deleted.'},
            status=status.HTTP_204_NO_CONTENT,
        )


@extend_schema(tags=['Documents'])
class DocumentDownloadView(APIView):
    """Download a document file."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id):
        from django.db.models import Q
        user = request.user
        try:
            if user.is_staff or user.role == 'ADMIN':
                doc = Document.objects.get(id=id)
            else:
                doc = Document.objects.get(
                    Q(user=user) | Q(shared_with=user), id=id
                )
        except Document.DoesNotExist:
            return Response(
                {'success': False, 'message': 'Document not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        return FileResponse(
            doc.file.open('rb'),
            as_attachment=True,
            filename=doc.title + doc.file_type,
        )


@extend_schema(tags=['Documents'])
class DocumentShareView(APIView):
    """Share a document with other users."""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DocumentShareSerializer

    def post(self, request, id):
        try:
            doc = Document.objects.get(id=id, user=request.user)
        except Document.DoesNotExist:
            return Response(
                {'success': False, 'message': 'Document not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = DocumentShareSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        from apps.accounts.models import User
        users = User.objects.filter(id__in=serializer.validated_data['user_ids'])
        doc.shared_with.add(*users)

        return Response(
            {'success': True, 'message': f'Document shared with {users.count()} user(s).'},
            status=status.HTTP_200_OK,
        )
