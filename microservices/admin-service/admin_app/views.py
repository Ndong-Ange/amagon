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

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def manage_seller(request, seller_id):
    if request.method == 'GET':
        # Get seller details from seller service
        try:
            seller = get_seller_from_service(seller_id)
            return Response(seller)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
    
    elif request.method == 'PUT':
        try:
            # Update seller details in seller service
            updated_seller = update_seller_in_service(seller_id, request.data)
            
            # Log the activity
            SellerActivity.objects.create(
                seller_id=seller_id,
                action_type='update',
                description=f'Seller information updated by admin {request.user.id}'
            )
            
            return Response(updated_seller)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

def get_seller_from_service(seller_id):
    # Implementation to fetch seller details from seller service
    # This would typically involve making an HTTP request to the seller service
    pass

def update_seller_in_service(seller_id, data):
    # Implementation to update seller details in seller service
    # This would typically involve making an HTTP request to the seller service
    pass