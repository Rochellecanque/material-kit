from django.urls import path
from . import views

urlpatterns = [
    path('parent_model_form/', views.parent_model_form_view, name='parent_model_form'),
    path('success/', TemplateView.as_view(template_name='success.html'), name='success_url'),
    # other paths
]
