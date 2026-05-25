# Check-App Deployment Guide

This guide covers deploying Check-App both locally and on Vercel.

## Local Deployment

### Prerequisites
- Node.js 18 or higher
- Python 3.9 or higher
- pip (Python package manager)

### Step-by-Step Setup

#### 1. Install Backend Dependencies

```bash
# Navigate to project root
cd check-app

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

#### 2. Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install npm packages
npm install

# Verify installation
npm list react tailwindcss lucide-react
```

#### 3. Run the Application

**Backend Server:**
```bash
# From project root (ensure venv is activated)
python app.py
```
The backend will start on `http://localhost:5050`

You should see:
```
Model loaded successfully from .../assets/model/CheckApp_LR_Model.pickle
Vectorizer loaded successfully from .../assets/model/vectorizer.pickle
Specialists database loaded: X records
 * Running on http://127.0.0.1:5050
```

**Frontend Development Server:**
```bash
# From frontend directory (new terminal)
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

#### 4. Test the Deployment

1. Open http://localhost:5173 in your browser
2. The chatbot should greet you
3. Test the `/health` endpoint: http://localhost:5050/health

## Production Build

### Build Frontend for Production

```bash
cd frontend
npm run build
```

This creates optimized files in `frontend/dist/`

### Serving Production Build

You can serve the built frontend statically alongside the Flask backend by modifying `app.py`:

```python
from flask import send_from_directory
import os

# Add this to app.py after app initialization
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path.startswith('api/') or path.startswith('chat/'):
        return 'Not found', 404
    
    frontend_path = os.path.join(os.path.dirname(__file__), 'frontend', 'dist', path)
    
    if os.path.isfile(frontend_path):
        return send_from_directory(os.path.join(os.path.dirname(__file__), 'frontend', 'dist'), path)
    
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'frontend', 'dist'), 'index.html')
```

Then serve with:
```bash
python app.py
```

## Vercel Deployment

Vercel is great for the frontend, but since we have a Python backend, we need to deploy them separately.

### Option A: Frontend on Vercel, Backend on Render/Railway

#### 1. Deploy Backend to Render/Railway

**For Render:**
1. Create account at https://render.com
2. Click "New +" -> "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: (leave empty)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Runtime**: Python 3

**For Railway:**
1. Create account at https://railway.app
2. Create new project from GitHub repo
3. Add Python plugin
4. Deploy automatically

#### 2. Deploy Frontend to Vercel

1. **Install Vercel CLI** (optional, can also use web UI):
    ```bash
   npm install -g vercel
    ```

2. **Create vercel.json** in frontend directory:
    ```json
    {
       "rewrites": [
          { "source": "/(.*)", "destination": "/" }
       ]
    }
    ```

3. **Update API URL in ChatUI.jsx**:
   Change the hardcoded localhost URLs to your backend URL:
   
   In `frontend/src/components/ChatUI.jsx`, find and replace:
   ```javascript
   // Old:
   const response = await fetch("http://localhost:5050/chat/analyze", {
   
   // New:
   const API_URL = import.meta.env.VITE_API_URL || "https://your-backend-url.onrender.com";
   const response = await fetch(`${API_URL}/chat/analyze`, {
   ```

4. **Create .env.local** in frontend directory:
    ```
   VITE_API_URL=https://your-backend-service.onrender.com
    ```

5. **Deploy to Vercel**:
   
   Using CLI:
    ```bash
   cd frontend
   vercel deploy --prod
    ```
   
   Or use https://vercel.com/dashboard to connect your GitHub repo and deploy.

#### 3. Configure Vercel Project Settings

In Vercel dashboard:
1. Go to your project settings
2. Under "Environment Variables", add:
   - `VITE_API_URL`: Your backend URL (e.g., https://your-app.onrender.com)

### Option B: Full-Stack on Vercel (Using Vercel Functions)

Since Vercel supports serverless functions, we can port the backend to use Vercel's API routes.

#### 1. Create Vercel Configuration

Create `vercel.json` in project root:
```json
{
   "version": 2,
   "builds": [
      {
         "src": "frontend/package.json",
         "use": "@vercel/static-build",
         "outputDirectory": "frontend/dist"
      },
      {
         "src": "api/routes.py",
         "use": "@vercel/python"
      }
   ],
   "routes": [
      {
         "src": "/chat/(.*)",
         "dest": "api/routes.py"
      },
      {
         "src": "/(.*)",
         "dest": "frontend/dist/index.html"
      }
   ]
}
```

#### 2. Create API Routes for Vercel

Create `api/routes.py`:
```python
import json
import pandas as pd
import pickle
from vercel import request, response
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Load models (executed on cold start)
BASE_DIR = os.path.dirname(__file__)
ROOT_DIR = os.path.dirname(BASE_DIR)

def load_assets():
    try:
        with open(os.path.join(ROOT_DIR, 'assets/model/CheckApp_LR_Model.pickle'), 'rb') as f:
            model = pickle.load(f)
        with open(os.path.join(ROOT_DIR, 'assets/model/vectorizer.pickle'), 'rb') as f:
            vectorizer = pickle.load(f)
        df_doc = pd.read_csv(os.path.join(ROOT_DIR, 'assets/csv/specialists.csv'))
        return model, vectorizer, df_doc
    except Exception as e:
        return None, None, pd.DataFrame()

model_, vectorizer, df_doc = load_assets()

def handle_analyze(body):
    # ... (same logic as backend/__init__.py)
    pass

def handle_recommend(body):
    # ... (same logic as backend/__init__.py)
    pass

def handler(request):
    path = request.url.split('/chat/')[1] if '/chat/' in request.url else ''
    
    if path == 'analyze':
        body = json.loads(request.body)
        result = handle_analyze(body)
        return response.json(result)
    
    elif path == 'recommend':
        body = json.loads(request.body)
        result = handle_recommend(body)
        return response.json(result)
    
    return response.json({"error": "Not found"}, status=404)
```

#### 3. Update Frontend API Calls

No changes needed if using relative URLs or `VITE_API_URL`.

#### 4. Deploy

```bash
vercel --prod
```

### Option C: Docker Deployment (Any Platform)

Create `Dockerfile` in project root:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install Node.js for frontend build
RUN apt-get update && apt-get install -y nodejs npm

# Copy backend files
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy frontend and build
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm install
RUN npm run build
WORKDIR /app

# Copy app files
COPY . .

EXPOSE 5050

CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t check-app .
docker run -p 5050:5050 check-app
```

Deploy to any container platform (AWS ECS, Google Cloud Run, Azure Container Instances).

## Environment Variables

For production, set these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `FLASK_ENV` | Environment mode | `production` |
| `PORT` | Backend port (optional) | `5050` |
| `VITE_API_URL` | Backend URL for frontend | `https://api.checkapp.com` |

## Troubleshooting

### Backend won't start
- Ensure virtual environment is activated
- Check that model files exist in `assets/model/`
- Verify CSV file exists in `assets/csv/`

### Frontend can't connect to backend
- Check CORS is enabled in Flask
- Verify `VITE_API_URL` matches your deployed backend URL
- Check browser console for CORS errors

### Model not loading
- Ensure pickle files are in correct location
- Check file permissions
- Verify Python version compatibility (models saved with Python 3.9+)

## Performance Considerations

- **Model Loading**: Models are loaded on startup - consider pre-warming instances in production
- **Cold Starts**: Serverless deployments will have cold start delays (2-5 seconds)
- **Database**: Consider migrating from CSV to a proper database for large datasets

## Monitoring

Add health checks:
```bash
curl https://your-app.com/health
```

Expected response:
```json
{
   "status": "healthy",
   "model_loaded": true,
   "specialists_count": 286
}
```
