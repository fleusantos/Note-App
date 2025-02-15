from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView

# Create your views here.

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({'error': 'Please provide both email and password'}, 
                      status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({'error': 'User with this email already exists'}, 
                      status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create(
        email=email,
        password=make_password(password)
    )
    
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }, status=status.HTTP_201_CREATED)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'created_at': user.created_at
        })

    def patch(self, request):
        user = request.user
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        user.save()
        return Response({
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'created_at': user.created_at
        })
