# Deploying Neural Msg to Heroku 🚀

This guide explains how to deploy the Neural Msg - Discord Scheduled Messages API to Heroku using Docker.

## Prerequisites

-   Heroku CLI installed (`npm install -g heroku`)
-   Docker installed
-   Git repository initialized
-   All files from the project, including:
    -   Dockerfile
    -   heroku.yml
    -   .dockerignore

## Step by Step Deployment 📋

### 1. Login to Heroku

```bash
heroku login
```

### 2. Create Heroku App

```bash
heroku create api-messages-discord
```

### 3. Set Stack to Container

```bash
heroku stack:set container
```

### 4. Configure Environment Variables 🔐

Set all required environment variables in Heroku:

```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set DISCORD_TOKEN=your_discord_bot_token
heroku config:set DISCORD_CHANNEL_ID=your_channel_id
heroku config:set API_KEY=your_api_key
heroku config:set API_KEY_SALT=your_api_key_salt
heroku config:set CHUNK_SIZE=100
```

### 5. Deploy Application 🚀

Push the code to Heroku:

```bash
git push heroku main
```

### 6. Verify Deployment

```bash
heroku logs --tail
```

### 7. Scale Dynos (if needed)

```bash
heroku ps:scale web=1
```

## Configuration Files 📄

### Dockerfile

```dockerfile
FROM oven/bun:1.2.0

WORKDIR /app

COPY package.json .
COPY bun.lock .

RUN bun install --frozen-lockfile

COPY . .

ENV PORT=4000
CMD ["bun", "start"]
```

### heroku.yml

```yaml
build:
    docker:
        web: Dockerfile
```

### .dockerignore

```
node_modules
npm-debug.log
.env
.git
.gitignore
logs/
```

## Important Notes 📝

1. **Environment Variables**: Make sure all sensitive data is configured in Heroku and not committed to the repository.

2. **Logging**: Heroku's filesystem is ephemeral. Logs in the logs directory won't persist. Use Heroku's logging system:

    ```bash
    heroku logs --tail
    ```

3. **MongoDB**: Use MongoDB Atlas or another cloud provider for the database.

4. **Discord Bot**: Ensure your Discord bot is properly configured and has the necessary permissions.

## Monitoring & Maintenance 🔍

### View Logs

```bash
heroku logs --tail
```

### Check App Status

```bash
heroku ps
```

### Restart Application

```bash
heroku restart
```

## Troubleshooting 🔧

1. If the app crashes, check logs:

```bash
heroku logs --tail
```

2. If environment variables are missing:

```bash
heroku config
```

3. To run the app in maintenance mode:

```bash
heroku maintenance:on
```

4. To check build logs:

```bash
heroku builds:info
```

## Additional Resources 📚

-   [Heroku Docker Deployment](https://devcenter.heroku.com/articles/container-registry-and-runtime)
-   [Heroku CLI Commands](https://devcenter.heroku.com/articles/heroku-cli-commands)
-   [Heroku Logging](https://devcenter.heroku.com/articles/logging)
-   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
