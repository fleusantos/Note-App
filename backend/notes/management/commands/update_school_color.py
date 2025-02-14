from django.core.management.base import BaseCommand
from notes.models import Category

class Command(BaseCommand):
    help = 'Updates the school category color'

    def handle(self, *args, **kwargs):
        school_category = Category.objects.filter(name='School').first()
        if school_category:
            school_category.color = '#FCDC94'  # Store without opacity in database
            school_category.save()
            self.stdout.write(self.style.SUCCESS(f"Updated school category color to #FCDC94"))
        else:
            self.stdout.write(self.style.WARNING("School category not found"))
