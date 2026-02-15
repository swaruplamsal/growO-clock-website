"""
Views for the consultations app.
"""

from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.utils import timezone
from drf_spectacular.utils import extend_schema

from .models import Consultation, ConsultationDocument
from .serializers import (
    ConsultationSerializer,
    ConsultationCreateSerializer,
    ConsultationDocumentSerializer,
    ConsultationRescheduleSerializer,
    ConsultationAssignSerializer,
)
from utils.permissions import IsOwnerOrAdmin, IsAdminUser


@extend_schema(tags=['Consultations'])
class ConsultationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing consultations.

    list: List user's consultations (or all for admin).
    create: Create a new consultation request.
    retrieve: Get consultation details.
    update: Update a consultation.
    destroy: Cancel a consultation.
    """
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'consultation_type']
    search_fields = ['subject', 'message']
    ordering_fields = ['created_at', 'scheduled_date']

    def get_serializer_class(self):
        if self.action == 'create':
            return ConsultationCreateSerializer
        return ConsultationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'ADMIN':
            return Consultation.objects.all()
        if user.role == 'ADVISOR':
            return Consultation.objects.filter(
                models__in=[
                    Consultation.objects.filter(user=user),
                    Consultation.objects.filter(advisor=user),
                ]
            ).distinct()
        return Consultation.objects.filter(user=user)

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'ADMIN':
            return Consultation.objects.all().select_related('user', 'advisor')
        if user.role == 'ADVISOR':
            from django.db.models import Q
            return Consultation.objects.filter(
                Q(user=user) | Q(advisor=user)
            ).select_related('user', 'advisor')
        return Consultation.objects.filter(user=user).select_related('user', 'advisor')

    def perform_destroy(self, instance):
        instance.status = Consultation.Status.CANCELLED
        instance.save(update_fields=['status'])

    @action(detail=True, methods=['post'], url_path='reschedule')
    def reschedule(self, request, pk=None):
        """Reschedule a consultation."""
        consultation = self.get_object()
        serializer = ConsultationRescheduleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        consultation.scheduled_date = serializer.validated_data['scheduled_date']
        consultation.status = Consultation.Status.SCHEDULED
        consultation.save(update_fields=['scheduled_date', 'status'])

        return Response(
            {
                'success': True,
                'message': 'Consultation rescheduled successfully.',
                'data': ConsultationSerializer(consultation).data,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=['get', 'post'], url_path='documents',
            parser_classes=[MultiPartParser, FormParser])
    def documents(self, request, pk=None):
        """List or upload consultation documents."""
        consultation = self.get_object()

        if request.method == 'GET':
            docs = consultation.documents.all()
            serializer = ConsultationDocumentSerializer(docs, many=True)
            return Response({'success': True, 'data': serializer.data})

        # POST - Upload document
        file = request.FILES.get('file')
        if not file:
            return Response(
                {'success': False, 'message': 'No file provided.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        doc = ConsultationDocument.objects.create(
            consultation=consultation,
            file=file,
            filename=file.name,
            file_size=file.size,
            uploaded_by=request.user,
        )
        return Response(
            {
                'success': True,
                'message': 'Document uploaded successfully.',
                'data': ConsultationDocumentSerializer(doc).data,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['patch'], url_path='assign',
            permission_classes=[IsAdminUser])
    def assign_advisor(self, request, pk=None):
        """Assign an advisor to a consultation (admin only)."""
        consultation = self.get_object()
        serializer = ConsultationAssignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        from apps.accounts.models import User
        advisor = User.objects.get(id=serializer.validated_data['advisor_id'])
        consultation.advisor = advisor
        consultation.status = Consultation.Status.SCHEDULED
        consultation.save(update_fields=['advisor', 'status'])

        return Response(
            {
                'success': True,
                'message': 'Advisor assigned successfully.',
                'data': ConsultationSerializer(consultation).data,
            },
            status=status.HTTP_200_OK,
        )
