from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Note, Category
from .factories import NoteFactory, CategoryFactory
from users.factories import UserFactory

class NoteModelTests(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.category = CategoryFactory(user=self.user)
        self.note = NoteFactory(user=self.user, category=self.category)

    def test_note_creation(self):
        self.assertTrue(isinstance(self.note, Note))
        self.assertEqual(str(self.note), self.note.title)

    def test_note_list_filtering(self):
        note2 = NoteFactory(user=self.user, category=self.category)
        other_user = UserFactory()
        other_note = NoteFactory(user=other_user)
        
        self.assertEqual(Note.objects.filter(user=self.user).count(), 2)
        self.assertEqual(Note.objects.filter(user=other_user).count(), 1)

class NoteAPITests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.category = CategoryFactory(user=self.user)
        self.note = NoteFactory(user=self.user, category=self.category)
        self.list_url = reverse('note-list')
        self.detail_url = reverse('note-detail', kwargs={'pk': self.note.pk})

    def test_create_note(self):
        data = {
            'title': 'Test Note',
            'content': 'Test Content',
            'category': self.category.id
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.count(), 2)
        self.assertEqual(Note.objects.latest('id').title, 'Test Note')

    def test_update_note(self):
        data = {
            'title': 'Updated Title',
            'content': self.note.content,
            'category': self.category.id
        }
        response = self.client.put(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.note.refresh_from_db()
        self.assertEqual(self.note.title, 'Updated Title')

    def test_delete_note(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Note.objects.count(), 0)

    def test_list_notes(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class CategoryAPITests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.category = CategoryFactory(user=self.user)
        self.list_url = reverse('category-list')
        self.detail_url = reverse('category-detail', kwargs={'pk': self.category.pk})

    def test_create_category(self):
        data = {
            'name': 'New Category',
            'color': '#FF0000'
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 2)

    def test_list_categories(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
