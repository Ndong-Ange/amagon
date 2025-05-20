from django.urls import path
from . import views

urlpatterns = [
    path('login', views.admin_login, name='admin_login'),
    path('setup', views.create_default_admin, name='create_default_admin'),
    path('me', views.get_admin_info, name='get_admin_info'),
    path('activities', views.get_seller_activities, name='get_seller_activities'),
]