# Deploy Open WebUI on Hugging Face (FREE & RELIABLE)

## This WILL Work - Step by Step

### 1. Go to Hugging Face
```
https://huggingface.co
```
Sign up for free account

### 2. Create New Space
Click your profile icon → "New Space"

### 3. Configure Space
- **Space name**: `my-ollama-chat` (or whatever you want)
- **Select SDK**: Choose **"Docker"**
- **Select template**: Choose **"Blank"**
- **Visibility**: Public (for free tier)
- Click "Create Space"

### 4. Create the Dockerfile
Once in your Space, click "Files" tab, then "Add file" → "Create a new file"

**File name**: `Dockerfile`

**File contents**:
```dockerfile
FROM ghcr.io/open-webui/open-webui:main

ENV OLLAMA_BASE_URL="http://157.180.53.167:11434"
ENV WEBUI_AUTH="False"

EXPOSE 7860

CMD ["bash", "start.sh"]
```

Click "Commit new file to main"

### 5. Wait for Build
- The Space will automatically start building
- Takes about 3-5 minutes
- You'll see logs in the "App" tab

### 6. Access Your Chat!
Once built, you'll see your chat interface right in the Space!
- URL will be: `https://huggingface.co/spaces/YOUR_USERNAME/my-ollama-chat`
- Works on phone, laptop, anywhere!

## If You Get Errors:

### Error: "Connection to Ollama failed"
Your Ollama server needs CORS enabled. On your EX-44 server, run:
```bash
OLLAMA_ORIGINS="*" OLLAMA_HOST="0.0.0.0:11434" ollama serve
```

### Error: Build fails
Try simpler Dockerfile:
```dockerfile
FROM ghcr.io/open-webui/open-webui:main
ENV OLLAMA_BASE_URL="http://157.180.53.167:11434"
```

## Why This Works Better Than Render:
- Hugging Face has better support for ghcr.io images
- No port configuration needed
- Free tier is more generous
- Build logs are clearer
- Community support is better

## Direct Link to Create:
https://huggingface.co/new-space?sdk=docker