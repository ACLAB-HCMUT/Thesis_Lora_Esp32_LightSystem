# Dockerized Node.js Application with Nginx Reverse Proxy

This repository demonstrates a setup for deploying a Node.js backend application with **Nginx** as a reverse proxy using **Docker Compose**. The backend service is replicated to ensure high availability and load balancing.

---

## Features
- **Docker Compose** setup with:
  - Backend service (`be`): A Node.js application with 3 replicas.
  - Reverse proxy (`nginx`): Handles routing and load balancing between backend replicas.
- **Load balancing** with Nginx's `upstream` directive.
- Containerized environment for easy deployment and scalability.

---

## Architecture Overview

### **Application Flow**
1. A client sends an HTTP request to the server at `http://<server-ip>:3000`.
2. Nginx (listening on port `3000`) receives the request and forwards it to the backend (`be`).
3. Nginx routes the request to one of the backend replicas using a round-robin load-balancing strategy.
4. The backend processes the request and returns the response to Nginx.
5. Nginx sends the response back to the client.

### **Workflow**
```plaintext
Client
  |
  | HTTP Request
  v
[Host Machine (port 3000)]
  |
  | Docker Port Mapping (3000:80)
  v
[Nginx Container (port 80)]
  |
  | Proxy to upstream app_cluster
  v
[Backend Container (one of 3 replicas)]
  |
  | Process Request
  v
[Nginx Container]
  |
  | Response
  v
Client


### 