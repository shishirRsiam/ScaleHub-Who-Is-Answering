"""
ScaleHub REST API — Views
=========================

All class-based API views for the ScaleHub platform.
"""

import socket
import time
import getpass

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import LearningSession
from .serializers import (
    LearningSessionSerializer,
    UserRegistrationSerializer,
    UserSerializer,
)


# ---------------------------------------------------------------------------
# Private helper
# ---------------------------------------------------------------------------

def _get_container_id() -> str:
    """Return the hostname of the running Docker container."""
    try:
        # how to print system name?
        print("System name:", getpass.getuser())
        return socket.gethostname()
    except OSError:
        return "unknown"


# ---------------------------------------------------------------------------
# Authentication  —  POST /api/v1/auth/register/
# ---------------------------------------------------------------------------

class RegisterView(APIView):
    """Register a new user account."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        return Response(
            {
                "message": "Registration successful. Welcome to ScaleHub!",
                "user": UserSerializer(user).data,
                "container_id": _get_container_id(),
            },
            status=status.HTTP_201_CREATED,
        )


# ---------------------------------------------------------------------------
# User Profile  —  GET /api/v1/user/profile/
# ---------------------------------------------------------------------------

class ProfileView(APIView):
    """Retrieve the authenticated user's full profile."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)

        return Response(
            {
                "user": serializer.data,
                "container_id": _get_container_id(),
            }
        )


# ---------------------------------------------------------------------------
# Update Profile  —  PUT /api/v1/user/profile/update/
# ---------------------------------------------------------------------------

class UpdateProfileView(APIView):
    """Update the authenticated user's editable profile fields."""
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        user_profile = user.profile  # OneToOne relation — always exists after register

        # Apply updates to the Django User model (first_name, last_name).
        user_fields = ("first_name", "last_name")
        for field in user_fields:
            if field in request.data:
                setattr(user, field, request.data[field])

        # Apply updates to the UserProfile model (avatar, bio).
        profile_fields = ("avatar", "bio")
        for field in profile_fields:
            if field in request.data:
                setattr(user_profile, field, request.data[field])

        # Persist both models in a single round-trip each.
        user.save()
        user_profile.save()

        return Response(
            {
                "message": "Profile updated successfully.",
                "user": UserSerializer(user).data,
                "container_id": _get_container_id(),
            }
        )


# ---------------------------------------------------------------------------
# Learning Sessions  —  GET /api/v1/user/sessions/
# ---------------------------------------------------------------------------
from django.utils import timezone
class SessionListView(APIView):
    """Return the recent learning sessions for the current user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = LearningSession.objects.filter(user=request.user).order_by("-timestamp")
        serializer = LearningSessionSerializer(sessions, many=True)

        return Response({
            "sessions": serializer.data,
            "container_id": _get_container_id(),
            "updated_at": timezone.now().isoformat(),
        })


# ---------------------------------------------------------------------------
# Scale Test  —  GET /api/v1/scale/test/
# ---------------------------------------------------------------------------

class ScaleTestView(APIView):
    """Trigger a scaling test and optionally record a session."""
    permission_classes = [AllowAny]

    def get(self, request):
        container_id = _get_container_id()
        start = time.perf_counter()

        if request.user.is_authenticated:
            elapsed = time.perf_counter() - start
            LearningSession.objects.create(
                user=request.user,
                container_id=container_id,
                endpoint="scale_test",
                status="success",
                response_time=elapsed,
            )

        return Response({
            "message": "Successfully connected to ScaleHub backend!",
            "container_id": container_id,
            "timestamp": time.time(),
            "status": "success",
        })


# ---------------------------------------------------------------------------
# Health Check  —  GET /api/v1/health/
# ---------------------------------------------------------------------------

class HealthCheckView(APIView):
    """Liveness probe used by Docker and orchestration tools."""
    permission_classes = [AllowAny]

    def get(self, request):
        formatted_time = time.strftime("%d %b %Y %H:%M:%S") + " UTC+6"
        return Response(
            {
                "status": "healthy",
                "time": formatted_time,
                "container_id": _get_container_id(),
            }
        )