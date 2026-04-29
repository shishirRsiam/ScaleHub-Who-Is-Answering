from django.contrib import admin
from .models import UserProfile, LearningSession

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'updated_at']
    search_fields = ['user__username']

@admin.register(LearningSession)
class LearningSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'container_id', 'endpoint', 'timestamp', 'status']
    search_fields = ['user__username', 'container_id']
    list_filter = ['status', 'timestamp']
