from django.urls import path
from . import views

urlpatterns = [
    path('login', views.admin_login, name='admin_login'),
    path('setup', views.create_default_admin, name='create_default_admin'),
]