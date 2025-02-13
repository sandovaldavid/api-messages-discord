# Neural Msg - API de Mensajes Programados para Discord 🤖

<div align="center">

![Versión](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D22.13.1-brightgreen)
![Bun](https://img.shields.io/badge/bun-%3E%3D1.2.0-orange)
![Licencia](https://img.shields.io/badge/license-MIT-green)
[![Documentación API](https://img.shields.io/badge/API-Documentation-blue)](https://api-neural-msg.devprojects.tech/api-docs)

[English](README.en.md) | [Español](README.es.md)

</div>

## 📖 Documentación

- [Documentación API](https://api-neural-msg.devprojects.tech/api-docs)
- [Guía de Despliegue](../guides/deployment/deploy-heroku.es.md)

## 🌟 Descripción General

Un servicio API RESTful para programar y gestionar mensajes de Discord a través del bot Neural Msg. Perfecto para planificación de contenido, anuncios y mensajería automatizada.

### Características Principales

- 📅 Programa mensajes con soporte de zona horaria
- 📊 Gestiona canales y servidores de Discord
- 🔄 Sincronización automática con Discord
- 📝 Operaciones CRUD para mensajes
- 🔐 Autenticación segura de API
- 📋 Sistema completo de registros

## 🚀 Inicio Rápido

1. **Clonar e Instalar**

```bash
git clone https://github.com/sandovaldavid/api-messages-discord.git
cd api-messages-discord
bun install
```

2. **Configurar Entorno**

```bash
cp .env.example .env
# Edita .env con tus credenciales
```

3. **Generar Claves API**

```bash
bun run generate-key
```

4. **Iniciar Servidor**

```bash
# Desarrollo
bun run dev

# Producción
bun start
```

## 🛠️ Tecnologías Utilizadas

- Runtime: [Bun](https://bun.sh/) >= 1.2.0
- Framework: [Express](https://expressjs.com/)
- Base de Datos: [MongoDB](https://www.mongodb.com/)
- Discord: [Discord.js](https://discord.js.org/)
- Documentación: [Swagger](https://swagger.io/)
- Registros: [Winston](https://github.com/winstonjs/winston)

## 📚 Endpoints de la API

### Mensajes

| Método | Endpoint                | Descripción                |
| ------ | ----------------------- | -------------------------- |
| POST   | `/api/messages`         | Crear mensaje programado   |
| GET    | `/api/messages`         | Listar todos los mensajes  |
| GET    | `/api/messages/pending` | Listar mensajes pendientes |
| GET    | `/api/messages/sent`    | Listar mensajes enviados   |
| PATCH  | `/api/messages/:id`     | Actualizar mensaje         |
| DELETE | `/api/messages/:id`     | Eliminar mensaje           |

### Canales

| Método | Endpoint                          | Descripción          |
| ------ | --------------------------------- | -------------------- |
| GET    | `/api/channels`                   | Listar canales       |
| GET    | `/api/channels/text`              | Listar canales texto |
| GET    | `/api/channels/sync`              | Sincronizar Discord  |
| GET    | `/api/channels/guild/:guildId`    | Listar por servidor  |
| PATCH  | `/api/channels/:channelId/status` | Actualizar estado    |

### Servidores

| Método | Endpoint                        | Descripción         |
| ------ | ------------------------------- | ------------------- |
| GET    | `/api/guilds`                   | Listar servidores   |
| GET    | `/api/guilds/sync`              | Sincronizar Discord |
| GET    | `/api/guilds/:guildId`          | Obtener detalles    |
| GET    | `/api/guilds/:guildId/channels` | Listar canales      |
| PATCH  | `/api/guilds/:guildId/status`   | Actualizar estado   |

## 🔒 Autenticación

Usa autenticación Bearer token:

```http
Authorization: Bearer tu_clave_api
```

## 📝 Registros

Los registros se almacenan en logs:

- `debug.log` - Información de depuración
- `error.log` - Mensajes de error
- `http.log` - Peticiones HTTP
- `combined.log` - Todos los registros

## 🤝 Contribuir

1. Haz un Fork
2. Crea una rama de funcionalidad (`git checkout -b feature/NuevaFuncionalidad`)
3. Realiza commits (`git commit -m 'Añadir NuevaFuncionalidad'`)
4. Sube la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Licencia MIT - ver el archivo LICENSE

## 👥 Autores

- David Sandoval - [@sandovaldavid](https://github.com/sandovaldavid)

## 🙏 Agradecimientos

- Equipo de Discord.js
- Equipo de MongoDB
- Comunidad de Express.js
- Comunidad de código abierto

## 📱 Contacto

- GitHub: [@sandovaldavid](https://github.com/sandovaldavid)
- Email: contact@devsandoval.me

## 🔗 Enlaces

- [Documentación API](https://api-neural-msg.devprojects.tech/api-docs)
- [Repositorio GitHub](https://github.com/sandovaldavid/api-messages-discord)
