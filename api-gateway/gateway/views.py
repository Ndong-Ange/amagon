import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
import jwt
from datetime import datetime, timedelta

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def auth_proxy(request):
    response = requests.request(
        method=request.method,
        url=f"{settings.MICROSERVICES['auth']}{request.path}",
        headers={key: value for key, value in request.headers.items()
                if key.lower() not in ['host']},
        data=request.body if request.body else None,
    )
    return JsonResponse(response.json(), status=response.status_code)

@api_view(['POST'])
def admin_login(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Verify against admin credentials
        if email == 'admin@amagon.com' and password == 'admin123':
            # Generate JWT token
            token = jwt.encode({
                'user_id': 'admin',
                'email': email,
                'role': 'admin',
                'exp': datetime.utcnow() + timedelta(days=1)
            }, settings.JWT_SECRET_KEY, algorithm='HS256')
            
            return JsonResponse({
                'token': token,
                'admin': {
                    'id': 'admin',
                    'email': email,
                    'name': 'Admin User',
                    'role': 'admin'
                }
            })
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
def admin_validate(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return JsonResponse({'error': 'No token provided'}, status=401)
    
    try:
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
        
        if payload.get('role') != 'admin':
            raise jwt.InvalidTokenError('Not an admin token')
            
        return JsonResponse({
            'admin': {
                'id': payload['user_id'],
                'email': payload['email'],
                'name': 'Admin User',
                'role': payload['role']
            }
        })
    except jwt.ExpiredSignatureError:
        return JsonResponse({'error': 'Token has expired'}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({'error': 'Invalid token'}, status=401)

@api_view(['GET'])
def admin_sellers(request):
    # Mock data for sellers
    sellers = [
        {
            'id': '1',
            'name': 'John Doe Store',
            'email': 'john@example.com',
            'totalSales': 15000,
            'productCount': 45,
            'lastActive': '2025-03-15T10:30:00Z'
        },
        {
            'id': '2',
            'name': 'Tech Haven',
            'email': 'tech@example.com',
            'totalSales': 28000,
            'productCount': 72,
            'lastActive': '2025-03-14T16:45:00Z'
        }
    ]
    return JsonResponse(sellers, safe=False)

@api_view(['GET'])
def admin_activities(request):
    # Mock data for activities
    activities = [
        {
            'id': '1',
            'seller_id': '1',
            'action_type': 'product_update',
            'description': 'Updated product inventory for "Wireless Headphones"',
            'created_at': '2025-03-15T10:30:00Z'
        },
        {
            'id': '2',
            'seller_id': '2',
            'action_type': 'order_processed',
            'description': 'Processed order #12345',
            'created_at': '2025-03-14T16:45:00Z'
        }
    ]
    return JsonResponse(activities, safe=False)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def product_proxy(request):
    response = requests.request(
        method=request.method,
        url=f"{settings.MICROSERVICES['product']}{request.path}",
        headers={key: value for key, value in request.headers.items()
                if key.lower() not in ['host']},
        data=request.body if request.body else None,
    )
    return JsonResponse(response.json(), status=response.status_code)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def order_proxy(request):
    response = requests.request(
        method=request.method,
        url=f"{settings.MICROSERVICES['order']}{request.path}",
        headers={key: value for key, value in request.headers.items()
                if key.lower() not in ['host']},
        data=request.body if request.body else None,
    )
    return JsonResponse(response.json(), status=response.status_code)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def inventory_proxy(request):
    response = requests.request(
        method=request.method,
        url=f"{settings.MICROSERVICES['inventory']}{request.path}",
        headers={key: value for key, value in request.headers.items()
                if key.lower() not in ['host']},
        data=request.body if request.body else None,
    )
    return JsonResponse(response.json(), status=response.status_code)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def seller_proxy(request):
    response = requests.request(
        method=request.method,
        url=f"{settings.MICROSERVICES['seller']}{request.path}",
        headers={key: value for key, value in request.headers.items()
                if key.lower() not in ['host']},
        data=request.body if request.body else None,
    )
    return JsonResponse(response.json(), status=response.status_code)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def store_proxy(request):
    response = requests.request(
        method=request.method,
        url=f"{settings.MICROSERVICES['store']}{request.path}",
        headers={key: value for key, value in request.headers.items()
                if key.lower() not in ['host']},
        data=request.body if request.body else None,
    )
    return JsonResponse(response.json(), status=response.status_code)