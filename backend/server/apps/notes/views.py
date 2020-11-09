from rest_framework import viewsets 
from apps.notes.models import Note 
from apps.notes.serializers import NoteSerializer

class NoteViewSet(viewsets.ModelViewSet):

    serializer_class = NoteSerializer
    queryset = Note.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(created_by=self.request.user)