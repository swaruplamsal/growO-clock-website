"""
Custom exception handler for standardized API error responses.
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from django.core.exceptions import ValidationError as DjangoValidationError
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """Custom exception handler returning standardized error responses."""
    response = exception_handler(exc, context)

    if response is not None:
        custom_response = {
            'success': False,
            'error': {
                'status_code': response.status_code,
                'message': _get_error_message(response),
                'details': response.data if isinstance(response.data, dict) else {'detail': response.data},
            }
        }
        response.data = custom_response
        return response

    # Handle Django ValidationError
    if isinstance(exc, DjangoValidationError):
        data = {
            'success': False,
            'error': {
                'status_code': 400,
                'message': 'Validation error',
                'details': exc.message_dict if hasattr(exc, 'message_dict') else {'detail': exc.messages},
            }
        }
        return Response(data, status=status.HTTP_400_BAD_REQUEST)

    # Handle unexpected errors
    if isinstance(exc, Exception):
        logger.exception(f'Unhandled exception: {exc}')
        data = {
            'success': False,
            'error': {
                'status_code': 500,
                'message': 'An unexpected error occurred. Please try again later.',
                'details': {},
            }
        }
        return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response


def _get_error_message(response):
    """Extract a human-readable error message from the response."""
    if isinstance(response.data, dict):
        if 'detail' in response.data:
            return str(response.data['detail'])
        # Get first error message
        for key, value in response.data.items():
            if isinstance(value, list) and value:
                return f'{key}: {value[0]}'
            elif isinstance(value, str):
                return f'{key}: {value}'
    elif isinstance(response.data, list) and response.data:
        return str(response.data[0])
    return 'An error occurred.'


class APIError(Exception):
    """Custom API error class."""

    def __init__(self, message, status_code=400, details=None):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)
