# app_name/admin.py

from django.contrib import admin
from .models import ParentModel, ChildModel

class ChildModelInline(admin.TabularInline):
    model = ChildModel
    extra = 1

@admin.register(ParentModel)
class ParentModelAdmin(admin.ModelAdmin):
    inlines = [ChildModelInline]

admin.site.register(ChildModel)
