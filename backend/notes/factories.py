import factory
from factory.django import DjangoModelFactory
from .models import Note, Category
from users.factories import UserFactory

class CategoryFactory(DjangoModelFactory):
    class Meta:
        model = Category

    name = factory.Sequence(lambda n: f'Category {n}')
    user = factory.SubFactory(UserFactory)

class NoteFactory(DjangoModelFactory):
    class Meta:
        model = Note

    title = factory.Sequence(lambda n: f'Note {n}')
    content = factory.Faker('text')
    user = factory.SubFactory(UserFactory)
    category = factory.SubFactory(CategoryFactory)
