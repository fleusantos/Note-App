import factory
from factory.django import DjangoModelFactory
from .models import CustomUser

class UserFactory(DjangoModelFactory):
    class Meta:
        model = CustomUser

    email = factory.Sequence(lambda n: f'user{n}@example.com')
    password = factory.PostGenerationMethodCall('set_password', 'testpass123')
    is_active = True
