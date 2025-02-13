# Neural Msg - Discord Scheduled Messages API 🤖

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D22.13.1-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

A RESTful API service that allows scheduling and managing Discord messages through a bot named Neural Msg. Perfect for content planning, announcements, and automated messaging.

## 🌟 Features

-   📅 Schedule messages to be sent at specific times
-   📊 Manage Discord channels and guilds
-   🔄 Sync channels and guilds with Discord
-   📝 Update or cancel scheduled messages
-   🔐 Secure API authentication
-   📋 Comprehensive logging system

## 🛠️ Prerequisites

-   Node.js >= 22.13.1
-   Bun >= 1.2.0
-   MongoDB database
-   Discord Bot Token
-   Discord Server with admin privileges

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CHANNEL_ID=default_channel_id
API_KEY=your_api_key
API_KEY_SALT=your_api_key_salt
CHUNK_SIZE=100
```

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/sandovaldavid/api-messages-discord.git
cd api-messages-discord
```

2. Install dependencies:

```bash
bun install
```

3. Generate API key and API_KEY_SALT:

```bash
bun run generate-key
```

4. Start the server:

```bash
# Development
bun run dev

# Production
bun start
```

## 📚 API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:4000/api-docs
```

### Available Endpoints:

-   📨 Messages

    -   `POST /api/messages` - Create scheduled message
    -   `GET /api/messages` - List all messages
    -   `GET /api/messages/pending` - List pending messages
    -   `GET /api/messages/sent` - List sent messages
    -   `PATCH /api/messages/:id` - Update message
    -   `DELETE /api/messages/:id` - Delete message

-   📺 Channels

    -   `GET /api/channels` - List all channels
    -   `GET /api/channels/text` - List text channels
    -   `GET /api/channels/sync` - Sync channels with Discord
    -   `GET /api/channels/guild/:guildId` - List channels by guild
    -   `GET /api/channels/:channelId` - Get data by channelId
    -   `PATCH /api/channels/:channelId/status` - Update channel status

-   🏰 Guilds
    -   `GET /api/guilds` - List all guilds
    -   `GET /api/guilds/sync` - Sync guilds with Discord
    -   `GET /api/guilds/:guildId` - Get data by guildId
    -   `GET /api/guilds/:guildId/channels` - List guild channels
    -   `GET /api/guilds/:guildId/status` - Get status details by guildId
    -   `PATCH /api/guilds/:guildId/status` - Update guild status

## 🔒 Authentication

All API endpoints require authentication using a Bearer token. Include the API key in the Authorization header:

```http
Authorization: Bearer your_api_key
```

## 📝 Logging

Logs are stored in the logs directory:

-   `debug.log` - Debug information
-   `error.log` - Error messages
-   `http.log` - HTTP requests
-   `combined.log` - All logs combined

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

-   David Sandoval - Initial work - [@sandovaldavid](https://github.com/sandovaldavid)

## 🙏 Acknowledgments

-   Discord.js team for their excellent library
-   MongoDB team for the database
-   Express.js community
