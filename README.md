# Pakjai — Anonymous WebChat

Pakjai is an anonymous, one-to-one chat application developed as part of an **AI/ML/DS course**. Users can create a room around a topic they want to discuss or join an available room to listen and chat, without signing up or entering a room code.

## Features

The project integrates AI for Thai services to check bullying and analyze the sentiment of room titles and chat drafts.

- Up to **100 rooms**, with **2 participants per room**.
- Real-time room availability and messaging through WebSocket.
- Room titles up to **80 characters** and chat messages up to **1,000 characters**.
- Bullying detection blocks room creation or message sending when detected.
- Negative sentiment displays a warning but still allows creation and sending if the bullying check passes. SSENSE failures do not block these actions.
- Rooms and messages are stored temporarily in server memory, with **no database**. Conversations are cleared when a participant leaves; closing a room removes it, and restarting the backend clears all rooms.

**Tech stack:** React, Vite, Python, FastAPI, WebSocket, AI for Thai, Docker Compose, Nginx, and Cloudflare Tunnel.

## Install dependencies

The examples below use **Windows Command Prompt (CMD)**. Run commands from the project root unless stated otherwise.

For local development, install **Python 3.12+** and **Node.js 22.13+ in the 22 LTS release line**, including npm. To run with Docker, install Docker Desktop with Docker Compose; host Python and Node.js installations are not required.

### Local dependencies

```cmd
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
npm --prefix frontend ci
```

### Environment variables

Create a `.env` file in the **project root**, next to `compose.yaml`:

```dotenv
API_KEY=your_ai_for_thai_api_key
SERVICE_URL=https://api.aiforthai.in.th/bully
SSENSE_URL=https://api.aiforthai.in.th/ssense
```

Use your own AI for Thai API key. These settings are read by the backend; do not put the key in frontend code or commit `.env` to Git. The same configuration is used for local and Docker runs.

The bullying service must be available for creating rooms and sending messages. The sentiment service provides advisory warnings only.

## Run local

After installing dependencies and configuring `.env`, run:

```cmd
local.cmd
```

This opens separate backend and frontend terminals. Alternatively, start them manually in two CMD windows:

**Backend — from the project root:**

```cmd
.venv\Scripts\python.exe backend\main.py
```

**Frontend — from the project root:**

```cmd
npm --prefix frontend run dev
```

Open **http://localhost:5173**. If Vite selects a different port because 5173 is occupied, use the URL printed in its terminal.

The backend runs at **http://127.0.0.1:8000**. Vite proxies `/api`, including the `/api/ws` WebSocket connection, to the backend. Open two browser tabs to test creating and joining a room.

Press `Ctrl+C` in each terminal to stop the local servers. Restarting the backend clears all in-memory rooms and conversations.

## Run Docker

Start Docker Desktop and ensure the root `.env` file is configured. Docker installs dependencies and builds the application inside its images.

### Run on your computer

```cmd
docker compose up --build -d --wait backend frontend
```

Open **http://localhost:8081**. Nginx serves the production frontend and proxies API and WebSocket traffic to FastAPI. Port 8081 is bound to the local machine; it is separate from Vite's development port 5173.

### Run with a public Cloudflare link

```cmd
start-docker.cmd
```

This starts the backend, frontend, and Cloudflare Tunnel, then prints a public HTTPS link and the local URL. The public link allows people on other devices to access the app. Quick Tunnel links are temporary and may change when the tunnel is recreated.

### Check status and stop

```cmd
docker compose ps
docker compose logs --tail 30
stop-docker.cmd
```

You can also stop the Docker stack with `docker compose down`. Closing the startup terminal alone does not stop containers running in the background.

The backend must run as **one worker / one instance** because room state is held in memory and is not shared between processes. API credentials are mounted into the backend at runtime rather than included in the images.
