from django.contrib import admin
from django.urls import include, path

from apps.accounts.urls import accounts_urlpatterns
from apps.notes.urls import notes_urlpatterns

urlpatterns = [
    path('api/', include('core.urls')),
    path('admin/', admin.site.urls),
    path('wopr/', include('wopr.urls')),
]

urlpatterns += accounts_urlpatterns # add URLs for authentication
urlpatterns += notes_urlpatterns # notes URLs