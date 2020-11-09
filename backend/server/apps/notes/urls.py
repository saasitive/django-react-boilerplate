from django.conf.urls import url, include 
from rest_framework.routers import DefaultRouter
from apps.notes.views import NoteViewSet

router = DefaultRouter()
router.register("notes", NoteViewSet, basename="notes")
notes_urlpatterns = [url("api/v1/", include(router.urls))]