# models.py

from django.db import models

class ParentModel(models.Model):
    id = models.BigAutoField(primary_key=True)
#    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=[('God', 'God'), ('Avatar', 'Avatar'), ('Demi God', 'Demi God'), ('Half God', 'Half God')], default='God')
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')], default='Male')
    owner = models.CharField(max_length=100)
    owner_email = models.EmailField(default='default@example.com')
    alternative_name = models.CharField(max_length=100, blank=True)  # Renamed from 'description'

    def __str__(self):
        return self.alternative_name

class ChildModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    parent = models.ForeignKey(ParentModel, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
