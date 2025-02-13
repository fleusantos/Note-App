from rest_framework import serializers
from .models import Category, Note

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        # Automatically set the user from the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'category', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        # Automatically set the user from the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
