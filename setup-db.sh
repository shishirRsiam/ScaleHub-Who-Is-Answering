#!/bin/bash

# Database and Migrations Setup Script

echo "=========================================="
echo "ScaleHub - Database Setup"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if containers are running
if ! docker-compose ps backend | grep -q "Up"; then
    echo "Error: Backend container is not running. Run 'docker-compose up -d' first."
    exit 1
fi

echo "Running migrations..."
docker-compose exec -T backend python manage.py migrate

if [ $? -ne 0 ]; then
    echo "Error: Migration failed"
    exit 1
fi

echo "✓ Migrations completed"
echo ""

# Optional: Create sample data
read -p "Create sample users for testing? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Creating sample users..."
    
    docker-compose exec -T backend python manage.py shell << EOF
from django.contrib.auth.models import User
from api.models import UserProfile

# Admin user
if not User.objects.filter(username='admin').exists():
    admin = User.objects.create_superuser('admin', 'admin@scalehub.local', 'admin123')
    UserProfile.objects.create(user=admin, bio='ScaleHub Administrator')
    print('✓ Admin user created (username: admin, password: admin123)')

# Sample users
users = [
    ('alice', 'alice@example.com', 'Alice', 'Johnson'),
    ('bob', 'bob@example.com', 'Bob', 'Smith'),
]

for username, email, first_name, last_name in users:
    if not User.objects.filter(username=username).exists():
        user = User.objects.create_user(
            username=username,
            email=email,
            password='testpass123',
            first_name=first_name,
            last_name=last_name
        )
        UserProfile.objects.create(user=user)
        print(f'✓ Sample user created (username: {username}, password: testpass123)')

print('\n✓ Database initialization complete!')
EOF
fi

echo ""
echo "=========================================="
echo "✓ Database Setup Complete!"
echo "=========================================="
echo ""
echo "You can now:"
echo "1. Login at http://localhost:3000"
echo "2. Use credentials from above"
echo "3. Start testing the application"
echo ""
