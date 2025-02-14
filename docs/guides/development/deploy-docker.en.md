# Deploying Neural Msg Locally with Docker 🐳

This guide explains how to deploy the Neural Msg - Discord Scheduled Messages API locally using Docker and Docker Compose.

## Prerequisites 📋

- Docker installed
- Docker Compose installed
- Git repository cloned
- Required files:
    - [`docker-compose.yml`](ocker-compose.yml)
    - [`docker/development/Dockerfile`](docker/development/Dockerfile)
    - [`.env`](.env.example)
    - [`.dockerignore`](.dockerignore)

## Directory Structure 📁

```bash
project-root/
├── docker/
│   └── development/
│       ├── docker-compose.yml
│       └── Dockerfile
├── docker-compose.yml
├── .env
└── .dockerignore
```

## Step by Step Deployment 🚀

### 1. Configure Environment Variables

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Required variables in .env:

```env
PORT=4000
MONGODB_URI=mongodb://dev-neural-msg:123456@mongo:27017/neural-msg-dev?authSource=admin
DISCORD_TOKEN=your_discord_token
DISCORD_CHANNEL_ID=your_channel_id
API_KEY=your_api_key
API_KEY_SALT=your_api_key_salt
MONGO_USER=dev-neural-msg
MONGO_PASSWORD=123456
MONGO_DATABASE=neural-msg-dev
```

### 2. Docker Configuration Files 🔧

#### Dockerfile:

```dockerfile
FROM oven/bun:1.2.0

WORKDIR /app

COPY package.json .

RUN bun install

COPY . .

CMD ["bun", "run", "dev"]
```

#### docker-compose.yml:

```yaml
services:
    dev-api:
        extends:
            file: docker/development/docker-compose.yml
            service: dev-api
        networks:
            - neural-msg-dev
        depends_on:
            - dev-mongo

    dev-mongo:
        extends:
            file: docker/development/docker-compose.yml
            service: dev-mongo
        networks:
            - neural-msg-dev
        volumes:
            - mongodb_data:/data/db

networks:
    neural-msg-dev:
        driver: bridge

volumes:
    mongodb_data:
        driver: local
    node_modules:
        driver: local
```

### 3. Build and Start Services 🏗️

```bash
# Build and start containers
docker-compose up dev-api --build

# Or run in detached mode
docker-compose up -d dev-api --build
```

### 4. Verify Deployment ✅

Check if services are running:

```bash
docker-compose ps
```

View logs:

```bash
docker-compose logs -f dev-api
```

## Container Management Commands 🛠️

```bash
# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# View logs
docker-compose logs -f

# Shell into container
docker-compose exec dev-api sh
```

## Common Issues and Solutions 🔍

1. **MongoDB Connection Issues**

    ```bash
    # Check MongoDB logs
    docker-compose logs dev-mongo
    ```

2. **API Not Accessible**

    - Verify port mappings
    - Check container status

    ```bash
    docker-compose ps
    ```

3. **Volume Permission Issues**
    ```bash
    # Fix permissions
    sudo chown -R $USER:$USER .
    ```

## Monitoring & Maintenance 📊

### View Container Stats

```bash
docker stats
```

### Check Container Health

```bash
docker-compose ps
```

### View API Logs

```bash
docker-compose logs -f dev-api
```

## Additional Resources 📚

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Bun Documentation](https://bun.sh/)

## Notes 📝

1. Development environment uses hot-reload
2. MongoDB data persists in named volume
3. Node modules are cached in volume
4. Environment variables are loaded from .env

## Security Considerations 🔒

1. Never commit sensitive data to Git
2. Use strong passwords for MongoDB
3. Keep Docker and dependencies updated
4. Follow security best practices for production deployments
