# Neural Msg - Discord Scheduled Messages API 🤖

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D22.13.1-brightgreen)
![Bun](https://img.shields.io/badge/bun-%3E%3D1.2.0-orange)
![License](https://img.shields.io/badge/license-MIT-green)
[![API Documentation](https://img.shields.io/badge/API-Documentation-blue)](https://api-neural-msg.devprojects.tech/api-docs)

[English](docs/readme/README.en.md) | [Español](docs/readme/README.es.md)

</div>

## 📖 Documentation

- [API Documentation](https://api-neural-msg.devprojects.tech/api-docs)
- [Deployment Guide](docs/guides/deployment/deploy-heroku.en.md)
- [Deploy in localhost](docs/guides/development/deploy-docker.en.md)

## 🌟 Overview

A RESTful API service for scheduling and managing Discord messages through Neural Msg bot. Perfect for content planning, announcements, and automated messaging.

### Key Features

- 📅 Schedule messages with timezone support
- 📊 Manage Discord channels and guilds
- 🔄 Automatic synchronization with Discord
- 📝 CRUD operations for messages
- 🔐 Secure API authentication
- 📋 Comprehensive logging system

## 🚀 Quick Start

1. **Clone and Install**

```bash
git clone https://github.com/sandovaldavid/api-messages-discord.git
cd api-messages-discord
bun install
```

2. **Configure Environment**

```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Generate API Keys**

```bash
bun run generate-key
```

4. **Start Server**

```bash
# Development
bun run dev

# Production
bun start
```

## 🛠️ Tech Stack

- Runtime: [Bun](https://bun.sh/) >= 1.2.0
- Framework: [Express](https://expressjs.com/)
- Database: [MongoDB](https://www.mongodb.com/)
- Discord: [Discord.js](https://discord.js.org/)
- Documentation: [Swagger](https://swagger.io/)
- Logging: [Winston](https://github.com/winstonjs/winston)

## 📚 API Endpoints

### Messages

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| POST   | `/api/messages`         | Create scheduled message |
| GET    | `/api/messages`         | List all messages        |
| GET    | `/api/messages/pending` | List pending messages    |
| GET    | `/api/messages/sent`    | List sent messages       |
| PATCH  | `/api/messages/:id`     | Update message           |
| DELETE | `/api/messages/:id`     | Delete message           |

### Channels

| Method | Endpoint                          | Description        |
| ------ | --------------------------------- | ------------------ |
| GET    | `/api/channels`                   | List all channels  |
| GET    | `/api/channels/text`              | List text channels |
| GET    | `/api/channels/sync`              | Sync with Discord  |
| GET    | `/api/channels/guild/:guildId`    | List by guild      |
| PATCH  | `/api/channels/:channelId/status` | Update status      |

### Guilds

| Method | Endpoint                        | Description         |
| ------ | ------------------------------- | ------------------- |
| GET    | `/api/guilds`                   | List all guilds     |
| GET    | `/api/guilds/sync`              | Sync with Discord   |
| GET    | `/api/guilds/:guildId`          | Get guild details   |
| GET    | `/api/guilds/:guildId/channels` | List guild channels |
| PATCH  | `/api/guilds/:guildId/status`   | Update guild status |

## 🔒 Authentication

Use Bearer token authentication:

```http
Authorization: Bearer your_api_key
```

## 📝 Logs

Logs are stored in logs:

- `debug.log` - Debug information
- `error.log` - Error messages
- `http.log` - HTTP requests
- `combined.log` - All logs

## 🤝 Contributing

1. Fork it
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see the LICENSE file

## 👥 Authors

- David Sandoval - [@sandovaldavid](https://github.com/sandovaldavid)

## 🙏 Acknowledgments

- Discord.js team
- MongoDB team
- Express.js community
- Open source community

## 📱 Contact

- GitHub: [@sandovaldavid](https://github.com/sandovaldavid)
- Email: contact@devsandoval.me

## 🔗 Links

- [API Documentation](https://api-neural-msg.devprojects.tech/api-docs)
- [GitHub Repository](https://github.com/sandovaldavid/api-messages-discord)
