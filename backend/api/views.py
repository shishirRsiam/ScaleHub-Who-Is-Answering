import socket
import time
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import UserSerializer, UserRegistrationSerializer, LearningSessionSerializer
from .models import UserProfile, LearningSession

def get_container_id():
    """Get the container ID from the hostname"""
    try:
        return socket.gethostname()
    except:
        return "unknown"

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """User registration endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data,
            'container_id': get_container_id()
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get current user profile"""
    user = request.user
    serializer = UserSerializer(user)
    return Response({
        'user': serializer.data,
        'container_id': get_container_id()
    })

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update user profile"""
    user = request.user
    profile = user.profile
    
    if 'avatar' in request.data:
        profile.avatar = request.data['avatar']
    if 'bio' in request.data:
        profile.bio = request.data['bio']
    if 'first_name' in request.data:
        user.first_name = request.data['first_name']
    if 'last_name' in request.data:
        user.last_name = request.data['last_name']
    
    profile.save()
    user.save()
    
    return Response({
        'message': 'Profile updated successfully',
        'user': UserSerializer(user).data,
        'container_id': get_container_id()
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sessions(request):
    """Get user's learning sessions"""
    user = request.user
    sessions = LearningSession.objects.filter(user=user).order_by('-timestamp')[:20]
    serializer = LearningSessionSerializer(sessions, many=True)
    
    return Response({
        'sessions': serializer.data,
        'container_id': get_container_id()
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def scale_test(request):
    """Test endpoint to demonstrate scaling"""
    container_id = get_container_id()
    response_time = time.time()
    
    if request.user.is_authenticated:
        # Log this session
        LearningSession.objects.create(
            user=request.user,
            container_id=container_id,
            endpoint='scale_test',
            response_time=time.time() - response_time
        )
    
    return Response({
        'message': 'Successfully connected to backend!',
        'container_id': container_id,
        'timestamp': time.time(),
        'status': 'success'
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint"""
    return Response({
        'status': 'healthy',
        'container_id': get_container_id()
    })
