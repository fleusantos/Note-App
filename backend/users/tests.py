from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import CustomUser
from .factories import UserFactory

# Create your tests here.

class UserModelTests(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def test_user_creation(self):
        self.assertTrue(isinstance(self.user, CustomUser))
        self.assertEqual(str(self.user), self.user.email)

    def test_user_profile_fields(self):
        self.assertIsNotNone(self.user.email)
        self.assertIsNotNone(self.user.created_at)
        self.assertTrue(self.user.is_active)

class UserAPITests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.profile_url = reverse('user-profile')

    def test_get_profile(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)

    def test_update_profile(self):
        data = {
            'first_name': 'Updated',
            'last_name': 'Name'
        }
        response = self.client.patch(self.profile_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')
        self.assertEqual(self.user.last_name, 'Name')
