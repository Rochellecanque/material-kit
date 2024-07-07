from django.contrib import admin
from .models import ParentModel, ChildModel
from .forms import ParentModelForm

class ChildModelInline(admin.TabularInline):
    model = ChildModel

@admin.register(ParentModel)
class ParentModelAdmin(admin.ModelAdmin):
    form = ParentModelForm
    inlines = [ChildModelInline]

@admin.register(ChildModel)
class ChildModelAdmin(admin.ModelAdmin):
    pass
