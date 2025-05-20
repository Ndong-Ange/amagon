from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from .models import AdminUser
import jwt
from django.conf import settings

@api_view(['POST'])
def admin_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        admin = AdminUser.objects.get(email=email)
        if check_password(password, admin.password):
            token = jwt.encode(
                {'user_id': str(admin.id), 'role': 'admin'},
                settings.JWT_SECRET_KEY,
                algorithm='HS256'
            )
            return Response({'token': token})
    except AdminUser.DoesNotExist:
        pass
    
    return Response(
        {'error': 'Invalid credentials'}, 
        status=status.HTTP_401_UNAUTHORIZED
    )

@api_view(['GET'])
def create_default_admin(request):
    if not AdminUser.objects.filter(email='admin@amagon.com').exists():
        AdminUser.objects.create(
            email='admin@amagon.com',
            password=make_password('admin123'),
            name='Admin',
            role='admin'
        )
        return Response({'message': 'Default admin created'})
    return Response({'message': 'Default admin already exists'})