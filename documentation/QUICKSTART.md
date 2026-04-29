# Docker Scaling Learning Platform - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Docker
- **Windows/Mac:** Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux:** `sudo apt-get install docker.io docker-compose`

### Step 2: Start the Application

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### Step 3: Access the Application
- **Frontend:** Open http://localhost:3000
- **Backend API:** http://localhost:8000/api/v1

### Step 4: Create an Account
1. Click "Register"
2. Fill in your details
3. Click "Create Account"
4. Login with your credentials

### Step 5: Test the Scaling
1. Go to Dashboard
2. Click "Test Scale Connection"
3. Watch the Container ID change on each click
4. Check Sessions to see history

## 📊 Understanding the Output

When you click "Test Scale Connection", you'll see:
```
Container ID: abc123def456
```

This is the actual Docker container ID. Each container is running Django with a different instance. Nginx load balances your requests across all instances.

## 🔄 How It Works

```
Your Browser
    ↓
Frontend (React) @ port 3000
    ↓
Nginx Load Balancer @ port 8000
    ↓
Backend Instances:
├── Container 1 (Django)
├── Container 2 (Django)
├── Container 3 (Django)
├── Container 4 (Django)
└── Container 5 (Django)
    ↓
PostgreSQL Database @ port 5432
```

## 🛠️ Common Commands

### View Running Containers
```bash
docker-compose ps
```

### View Logs
```bash
docker-compose logs -f backend
```

### Scale to 10 Containers
```bash
docker-compose up -d --scale backend=10
```

### Stop Everything
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

## 🎓 Learning Topics

- **Docker:** Containerization, images, volumes
- **Docker Compose:** Multi-container applications
- **Nginx:** Load balancing, reverse proxying
- **JWT:** Token-based authentication
- **React:** Modern UI, routing, state management
- **Django:** REST API, database models
- **PostgreSQL:** Relational database

## 🐛 Troubleshooting

**Port Already in Use?**
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Container Won't Start?**
```bash
docker-compose logs
docker-compose down -v
docker-compose up -d --build
```

**Backend Connection Error?**
1. Check if backend is running: `docker-compose ps`
2. Check logs: `docker-compose logs backend`
3. Verify CORS in settings.py

## 📱 Mobile Support

The application is fully responsive. You can access it on:
- Desktop browsers
- Tablets
- Mobile devices (at http://localhost:3000 on local network)

## 🎨 Premium Features

- Gradient backgrounds and text
- Smooth animations
- Dark theme
- Responsive design
- Glassmorphism effects
- Real-time data updates
- Loading states
- Error handling

## 🔒 Security

- JWT tokens for authentication
- Password hashing
- CORS protection
- Rate limiting
- SQL injection prevention
- Environment variable separation

## 📞 Need Help?

1. Check README.md for detailed documentation
2. Review docker-compose.yml for configuration
3. Check browser console for errors
4. Check container logs: `docker-compose logs`

## 📚 Next Steps

1. Explore the API endpoints
2. Try scaling to more containers
3. Monitor container load distribution
4. Customize the frontend
5. Add more features to the backend

**Ready? Start with Step 2 above!** 🚀
