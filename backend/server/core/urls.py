from django.urls import include, path
from core import views

urlpatterns = [
    path( '', views.index, name='index' ),
]
