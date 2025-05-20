from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from .models import AdminUser, SellerActivity
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_admin_info(request):
    admin = AdminUser.objects.get(id=request.user.id)
    return Response({
        'id': str(admin.id),
        'email': admin.email,
        'name': admin.name,
        'role': admin.role
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_seller_activities(request):
    activities = SellerActivity.objects.all().order_by('-created_at')[:50]
    return Response([{
        'id': str(activity.id),
        'seller_id': str(activity.seller_id),
        'action_type': activity.action_type,
        'description': activity.description,
        'created_at': activity.created_at
    } for activity in activities])