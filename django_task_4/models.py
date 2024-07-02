# models.py

from django.db import models
from django.core.validators import EmailValidator, RegexValidator

class ParentModel(models.Model):
    alternative_name = models.CharField(max_length=100, blank=True, null=True)
    category = models.CharField(max_length=100, blank=False)  # Non-empty validation
    gender = models.CharField(max_length=10, blank=False)  # Non-empty validation
    owner = models.CharField(max_length=100, blank=False)  # Non-empty validation
    owner_email = models.EmailField(
        validators=[EmailValidator()],
        blank=False,  # Non-empty validation
        default='default@example.com'
    )
    number = models.CharField(
        max_length=100,
        validators=[RegexValidator(r'^\d+$', message='This field must be numeric.')],
        blank=False,  # Non-empty 
        default='08888345'
    )

    def __str__(self):
        return self.alternative_name

class ChildModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    parent = models.ForeignKey(ParentModel, related_name='children', on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=False)

    def __str__(self):
        return self.name
