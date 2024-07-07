from django import forms
from .models import ParentModel

class ParentModelForm(forms.ModelForm):
    category_choices = [
        ('option1', 'Restaurant 1'),
        ('option2', 'Restaurant 2'),
        ('option3', 'Restaurant 3'),
    ]

    gender_choices = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    category = forms.ChoiceField(choices=category_choices, widget=forms.Select(attrs={'class': 'form-control'}))
    gender = forms.ChoiceField(choices=gender_choices, widget=forms.Select(attrs={'class': 'form-control'}))

    class Meta:
        model = ParentModel
        fields = ['category', 'owner', 'owner_email', 'alternative_name', 'number', 'gender']
        widgets = {
           # 'category': forms.Select(attrs={'class': 'form-control', 'placeholder': 'Enter Category'}), 
            'owner': forms.TextInput(attrs={'placeholder': 'Enter owner name'}),
            'owner_email': forms.EmailInput(attrs={'placeholder': 'Enter owner email address'}),
           # 'gender': forms.ChoiceField(choices=gender_choices, widget=forms.Select(attrs={'class': 'form-control'})),
            'number': forms.NumberInput(attrs={'placeholder': 'Enter number'}),
            'alternative_name': forms.TextInput(attrs={'placeholder': 'Enter alternative name'})
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['alternative_name'].required = False
