from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Authentication
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    
    # User Profile
    path('user/profile/', views.ProfileView.as_view(), name='profile'),
    path('user/profile/update/', views.UpdateProfileView.as_view(), name='update_profile'),
    path('user/sessions/', views.SessionListView.as_view(), name='sessions'),
    
    # Testing and Health
    path('scale/test/', views.ScaleTestView.as_view(), name='scale_test'),
    path('health/', views.HealthCheckView.as_view(), name='health'),
]