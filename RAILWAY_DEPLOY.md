# Deploy Open WebUI on Railway (More Reliable)

## Railway Deployment (Works Better Than Render)

### Step 1: Go to Railway
```
https://railway.app
```
Sign up with GitHub (free)

### Step 2: New Project
Click "New Project" → "Deploy from Docker Hub"

### Step 3: Configure Docker Image
- **Image**: `ollama/open-webui:latest`
- Click "Add Variables" and add:
  ```
  OLLAMA_BASE_URL=http://157.180.53.167:11434
  PORT=8080
  ```

### Step 4: Deploy
Click "Deploy" and wait 2-3 minutes

### Step 5: Generate Domain
- Go to Settings → Networking
- Click "Generate Domain"
- You'll get a URL like: `your-app.up.railway.app`

## Alternative: Quick Docker Run Command

If you have access to any Linux server (even a small VPS for $3.50/month from Hetzner):

```bash
docker run -d \
  -p 3000:8080 \
  -e OLLAMA_BASE_URL=http://157.180.53.167:11434 \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ollama/open-webui:latest
```

Then access at: `http://your-server-ip:3000`

## If Render Still Fails - Common Issues:

### Issue 1: Wrong Port
Add environment variable:
```
PORT=8080
```

### Issue 2: Health Check Failing
In Render settings:
- Health Check Path: `/`
- Or disable health check temporarily

### Issue 3: Memory Limits
- Upgrade to Render's paid tier ($7/month)
- Or use Railway ($5/month)

## Quickest Alternative: Hugging Face Spaces

1. Go to: https://huggingface.co/spaces
2. Click "Create new Space"
3. Choose "Docker" → "Blank"
4. Create file called `Dockerfile`:
```dockerfile
FROM ollama/open-webui:latest
ENV OLLAMA_BASE_URL=http://157.180.53.167:11434
EXPOSE 7860
```
5. Wait for build
6. Get free URL!

This usually works when Render fails.