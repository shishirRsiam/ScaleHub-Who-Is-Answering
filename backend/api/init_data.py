# Create superuser and sample data (optional)
from django.contrib.auth.models import User
from api.models import UserProfile

# Check if superuser exists
if not User.objects.filter(username='admin').exists():
    admin_user = User.objects.create_superuser('admin', 'admin@scalehub.local', 'admin123')
    UserProfile.objects.create(user=admin_user, bio='ScaleHub Administrator')
    print('✓ Admin superuser created')

# Create sample users for testing
sample_users = [
    ('alice', 'alice@example.com', 'Alice', 'Johnson'),
    ('bob', 'bob@example.com', 'Bob', 'Smith'),
    ('charlie', 'charlie@example.com', 'Charlie', 'Brown'),
]

for username, email, first_name, last_name in sample_users:
    if not User.objects.filter(username=username).exists():
        user = User.objects.create_user(
            username=username,
            email=email,
            password='testpass123',
            first_name=first_name,
            last_name=last_name
        )
        UserProfile.objects.create(
            user=user,
            bio=f'{first_name} loves Docker scaling!'
        )
        print(f'✓ Sample user {username} created')

print('✓ Database initialization complete!')
