"""
Views for the careers app.
"""

from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .models import JobPosition, JobApplication
from .serializers import (
    JobPositionSerializer,
    JobPositionListSerializer,
    JobApplicationCreateSerializer,
    JobApplicationSerializer,
)
from utils.permissions import IsAdminUser


@extend_schema(tags=['Careers'])
class JobPositionListView(generics.ListAPIView):
    """List active job positions (public)."""
    serializer_class = JobPositionListSerializer
    permission_classes = [permissions.AllowAny]
    queryset = JobPosition.objects.filter(is_active=True)
    filterset_fields = ['department', 'employment_type', 'location']
    search_fields = ['title', 'description']


@extend_schema(tags=['Careers'])
class JobPositionDetailView(generics.RetrieveAPIView):
    """Get job position details (public)."""
    serializer_class = JobPositionSerializer
    permission_classes = [permissions.AllowAny]
    queryset = JobPosition.objects.filter(is_active=True)
    lookup_field = 'id'


@extend_schema(tags=['Careers'])
class JobApplicationCreateView(generics.CreateAPIView):
    """Submit a job application (public)."""
    serializer_class = JobApplicationCreateSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                'success': True,
                'message': 'Your application has been submitted successfully!',
            },
            status=status.HTTP_201_CREATED,
        )


# ──── Admin Views ────

@extend_schema(tags=['Admin'])
class AdminJobPositionViewSet(generics.ListCreateAPIView):
    """List or create job positions (admin only)."""
    serializer_class = JobPositionSerializer
    permission_classes = [IsAdminUser]
    queryset = JobPosition.objects.all()


@extend_schema(tags=['Admin'])
class AdminJobPositionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Manage a job position (admin only)."""
    serializer_class = JobPositionSerializer
    permission_classes = [IsAdminUser]
    queryset = JobPosition.objects.all()
    lookup_field = 'id'


@extend_schema(tags=['Admin'])
class AdminApplicationListView(generics.ListAPIView):
    """List all job applications (admin only)."""
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAdminUser]
    queryset = JobApplication.objects.all().select_related('position')
    filterset_fields = ['status', 'position']
    search_fields = ['applicant_name', 'email']
    ordering_fields = ['created_at', 'status']


@extend_schema(tags=['Admin'])
class AdminApplicationDetailView(generics.RetrieveUpdateAPIView):
    """Get or update a job application (admin only)."""
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAdminUser]
    queryset = JobApplication.objects.all().select_related('position')
    lookup_field = 'id'
