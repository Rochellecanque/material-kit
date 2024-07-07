# admin.py

from django.contrib import admin
from .models import Project, Task
from .forms import ProjectForm, TaskForm

class TaskInline(admin.TabularInline):
    model = Task
    form = TaskForm
    extra = 1  # Number of extra blank tasks to display

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    form = ProjectForm
    inlines = [TaskInline]
    list_display = ('name', 'start_date', 'end_date', 'budget', 'status')
    search_fields = ('name', 'description')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    form = TaskForm
    list_display = ('title', 'project', 'due_date', 'completed')
    search_fields = ('title', 'description')
    list_filter = ('project', 'due_date', 'completed')
