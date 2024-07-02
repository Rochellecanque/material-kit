from django import forms
from .models import ParentModel

class ParentModelForm(forms.ModelForm):
    class Meta:
        model = ParentModel
        fields = ['category', 'gender', 'owner', 'owner_email', 'number', 'alternative_name']
