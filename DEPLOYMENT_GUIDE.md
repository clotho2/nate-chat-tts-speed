# LibreChat Deployment Guide

## ⚠️ Important: Vercel Compatibility

**LibreChat is NOT compatible with Vercel deployment.** Here's why:

1. **Architecture Mismatch**: LibreChat is a full-stack application built with:
   - Express.js backend (not Next.js)
   - MongoDB database requirement
   - WebSocket connections for real-time features
   - Docker-based deployment architecture
   - Persistent file storage requirements

2. **Vercel Limitations**: Vercel is optimized for:
   - Serverless functions (stateless)
   - Frontend frameworks (Next.js, React)
   - Short-lived HTTP requests
   - No persistent storage or long-running processes

## ✅ Recommended Deployment Options

### 1. **Local Development/Testing**
```bash
# Install dependencies
npm install

# Start MongoDB (required)
mongod

# Start the application
npm run backend  # Start backend server
npm run frontend:dev  # Start frontend (in another terminal)
```

### 2. **Docker Deployment (Recommended)**
```bash
# Using Docker Compose
docker compose up -d

# Or with your custom configuration
docker compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

### 3. **VPS/Cloud Server Deployment**
Deploy on:
- **DigitalOcean**: Droplets with Docker
- **AWS EC2**: With Docker or PM2
- **Google Cloud**: Compute Engine
- **Azure**: Virtual Machines
- **Hetzner**: Cloud servers
- **OVH**: VPS or dedicated servers

### 4. **Managed Hosting Services**
- **Railway**: One-click deployment available
- **Render**: Docker-based deployment
- **Fly.io**: Container-based hosting
- **Coolify**: Self-hosted PaaS

## 🔧 Your Ollama Configuration

Your configuration files have been set up to use your Ollama endpoint at `157.180.53.167:11434`. 

### Configuration Files Created:

1. **`.env`** - Contains your API keys and environment variables
2. **`librechat.yaml`** - Defines your Ollama endpoint and other AI services

### Important Setup Steps:

1. **Update API Keys in `.env`**:
   ```bash
   # Edit the .env file and replace placeholder values:
   OPENAI_API_KEY=your_actual_openai_key
   GOOGLE_API_KEY=your_actual_google_key
   TOGETHER_AI_API_KEY=your_actual_together_ai_key
   ```

2. **Generate Security Keys**:
   ```bash
   # Generate secure keys for production
   openssl rand -hex 32  # Use for CREDS_KEY
   openssl rand -hex 16  # Use for CREDS_IV
   openssl rand -hex 32  # Use for JWT_SECRET
   openssl rand -hex 32  # Use for JWT_REFRESH_SECRET
   ```

3. **MongoDB Setup**:
   - For local: Install MongoDB locally
   - For production: Use MongoDB Atlas (free tier available)
   - Update `MONGO_URI` in `.env`

4. **Verify Ollama Connection**:
   ```bash
   # Test your Ollama endpoint
   curl http://157.180.53.167:11434/api/tags
   ```

## 📁 Features Supported

### ✅ Chat Features
- Multi-model conversations (Ollama, OpenAI, Google, Together AI)
- Conversation branching and editing
- Custom presets and prompts
- Real-time streaming responses

### ✅ File Uploads
- **Images**: Supported for vision models
- **Documents**: PDF, Word, text files
- **Configuration**: Set in `librechat.yaml` under `fileConfig`

### ✅ Text-to-Speech (TTS)
- Configured to use OpenAI's TTS
- Can be extended to use Ollama if your models support it
- Configuration in `librechat.yaml` under `speech.tts`

### ✅ Speech-to-Text (STT)
- Uses OpenAI's Whisper model
- Configuration in `librechat.yaml` under `speech.stt`

## 🚀 Quick Start (Docker)

1. **Clone and prepare**:
   ```bash
   cd /workspace
   
   # Update your API keys in .env
   nano .env
   
   # Ensure Docker is installed
   docker --version
   ```

2. **Start with Docker Compose**:
   ```bash
   # Start all services
   docker compose up -d
   
   # Check logs
   docker compose logs -f
   ```

3. **Access LibreChat**:
   - Open browser: `http://localhost:3080`
   - Create an account or login
   - Select "Ollama (EX-44)" from the model dropdown

## 🔍 Troubleshooting

### Ollama Connection Issues
1. Ensure Ollama is accessible:
   ```bash
   curl http://157.180.53.167:11434/api/tags
   ```

2. If running LibreChat in Docker, you may need to:
   - Use host networking: `network_mode: host`
   - Or add to docker-compose.yml:
     ```yaml
     extra_hosts:
       - "host.docker.internal:host-gateway"
     ```

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- For Docker: MongoDB container should be in same network

### Port Conflicts
- Default port is 3080
- Change in `.env`: `PORT=3081`

## 📚 Additional Resources

- [Official Documentation](https://www.librechat.ai/docs)
- [Configuration Guide](https://www.librechat.ai/docs/configuration/librechat_yaml)
- [Custom Endpoints Guide](https://www.librechat.ai/docs/configuration/librechat_yaml/ai_endpoints)
- [Docker Setup](https://www.librechat.ai/docs/installation/docker_compose)

## 🎯 Next Steps

1. **For Local Development**:
   - Install Node.js 20+
   - Install MongoDB
   - Run `npm install`
   - Start with `npm run backend`

2. **For Production**:
   - Use a VPS or cloud server
   - Deploy with Docker
   - Set up reverse proxy (Nginx/Caddy)
   - Configure SSL certificates
   - Set up monitoring

3. **Alternative: Use a Different Stack**:
   If you specifically need Vercel deployment, consider:
   - **ChatGPT-Next-Web**: Next.js based, Vercel-compatible
   - **Chatbot-UI**: React-based, can be deployed on Vercel
   - **Custom Next.js wrapper**: Build a Next.js frontend that calls your Ollama API