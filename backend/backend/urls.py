"""
URL configuration for grow O'Clock backend.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API v1
    path('api/', include('apps.accounts.urls')),
    path('api/consultations/', include('apps.consultations.urls')),
    path('api/plans/', include('apps.financial_planning.urls')),
    path('api/investments/', include('apps.investments.urls')),
    path('api/calculators/', include('apps.financial_planning.calculator_urls')),
    path('api/blog/', include('apps.blog.urls')),
    path('api/contact/', include('apps.contact.urls')),
    path('api/careers/', include('apps.careers.urls')),
    path('api/documents/', include('apps.documents.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/admin/', include('apps.analytics.urls')),

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns = [path('__debug__/', include(debug_toolbar.urls))] + urlpatterns

# Admin site customization
admin.site.site_header = "grow O'Clock Administration"
admin.site.site_title = "grow O'Clock Admin"
admin.site.index_title = "Dashboard"
