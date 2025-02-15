from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Category, Note
from .serializers import CategorySerializer, NoteSerializer
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        category_id = self.request.query_params.get('category', None)
        queryset = Note.objects.filter(user=self.request.user)
        
        if category_id and category_id != 'all':
            queryset = queryset.filter(category_id=category_id)
        
        return queryset.select_related('category')

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        note = self.get_object()
        logger.info(f"Note updated - ID: {note.id}, Title: {note.title}, Content: {note.content}, Updated At: {note.updated_at}")
        return response
