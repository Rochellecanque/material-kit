from django.shortcuts import render, redirect
from .forms import ParentModelForm

def parent_model_form_view(request):
    if request.method == 'POST':
        form = ParentModelForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('success_url')  # Replace 'success_url' with the actual success URL or view name
    else:
        form = ParentModelForm()
    return render(request, 'django_task_4/parent_model_form.html', {'form': form})
