from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Category, Note
from .serializers import CategorySerializer, NoteSerializer

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
