# admin.py

from django.contrib import admin
from .models import ParentModel, ChildModel

class ChildModelInline(admin.TabularInline):
    model = ChildModel
    extra = 1  # Number of empty child model forms to display

@admin.register(ParentModel)
class ParentModelAdmin(admin.ModelAdmin):
    inlines = [ChildModelInline]
    list_display = ['category', 'gender', 'owner', 'owner_email', 'alternative_name']
    search_fields = ['category', 'owner', 'owner_email', 'alternative_name']

#admin.site.register(ChildModel)
#admin.site.register(ParentModel, ParentModelAdmin)