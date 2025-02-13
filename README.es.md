# Neural Msg - API de Mensajes Programados para Discord 🤖

![Versión](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D22.13.1-brightgreen)
![Licencia](https://img.shields.io/badge/license-MIT-green)

[English Version](README.md)

Un servicio API RESTful que permite programar y gestionar mensajes de Discord a través de un bot llamado Neural Msg. Perfecto para planificación de contenido, anuncios y mensajería automatizada.

## 🌟 Características

-   📅 Programa mensajes para ser enviados en momentos específicos
-   📊 Gestiona canales y servidores de Discord
-   🔄 Sincroniza canales y servidores con Discord
-   📝 Actualiza o cancela mensajes programados
-   🔐 Autenticación segura de API
-   📋 Sistema completo de registros

## 🛠️ Requisitos Previos

-   Node.js >= 22.13.1
-   Bun >= 1.2.0
-   Base de datos MongoDB
-   Token de Bot de Discord
-   Servidor de Discord con privilegios de administrador

## ⚙️ Variables de Entorno

Crea un archivo `.env` en el directorio raíz con las siguientes variables:

```env
PORT=4000
MONGODB_URI=tu_cadena_de_conexion_mongodb
DISCORD_TOKEN=tu_token_de_bot_discord
DISCORD_CHANNEL_ID=id_canal_por_defecto
API_KEY=tu_clave_api
API_KEY_SALT=tu_salt_api
CHUNK_SIZE=100
```

## 🚀 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/sandovaldavid/api-messages-discord.git
cd api-messages-discord
```

2. Instala las dependencias:

```bash
bun install
```

3. Genera la clave API y API_KEY_SALT:

```bash
bun run generate-key
```

4. Inicia el servidor:

```bash
# Desarrollo
bun run dev

# Producción
bun start
```

## 📦 Deployment

For detailed deployment instructions:

-   [Desplegar en Heroku](deploy-heroku.es.md)

## 📚 Documentación de la API

Una vez que el servidor esté en funcionamiento, puedes acceder a la documentación Swagger en:

```
http://localhost:4000/api-docs
```

### Endpoints Disponibles:

-   📨 Mensajes

    -   `POST /api/messages` - Crear mensaje programado
    -   `GET /api/messages` - Listar todos los mensajes
    -   `GET /api/messages/pending` - Listar mensajes pendientes
    -   `GET /api/messages/sent` - Listar mensajes enviados
    -   `PATCH /api/messages/:id` - Actualizar mensaje
    -   `DELETE /api/messages/:id` - Eliminar mensaje

-   📺 Canales

    -   `GET /api/channels` - Listar todos los canales
    -   `GET /api/channels/text` - Listar canales de texto
    -   `GET /api/channels/sync` - Sincronizar canales con Discord
    -   `GET /api/channels/guild/:guildId` - Listar canales por servidor
    -   `GET /api/channels/:channelId` - Obtener datos por ID de canal
    -   `PATCH /api/channels/:channelId/status` - Actualizar estado del canal

-   🏰 Servidores
    -   `GET /api/guilds` - Listar todos los servidores
    -   `GET /api/guilds/sync` - Sincronizar servidores con Discord
    -   `GET /api/guilds/:guildId` - Obtener datos por ID de servidor
    -   `GET /api/guilds/:guildId/channels` - Listar canales del servidor
    -   `GET /api/guilds/:guildId/status` - Obtener detalles de estado por ID de servidor
    -   `PATCH /api/guilds/:guildId/status` - Actualizar estado del servidor

## 🔒 Autenticación

Todos los endpoints de la API requieren autenticación usando un token Bearer. Incluye la clave API en el encabezado de Autorización:

```http
Authorization: Bearer tu_clave_api
```

## 📝 Registros

Los registros se almacenan en el directorio logs:

-   `debug.log` - Información de depuración
-   `error.log` - Mensajes de error
-   `http.log` - Solicitudes HTTP
-   `combined.log` - Todos los registros combinados

## 🤝 Contribuir

1. Haz un Fork del repositorio
2. Crea tu rama de características (`git checkout -b feature/CaracteristicaIncreible`)
3. Haz commit de tus cambios (`git commit -m 'Añadir alguna CaracteristicaIncreible'`)
4. Haz Push a la rama (`git push origin feature/CaracteristicaIncreible`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 👥 Autores

-   David Sandoval - Trabajo inicial - [@sandovaldavid](https://github.com/sandovaldavid)

## 🙏 Agradecimientos

-   Equipo de Discord.js por su excelente librería
-   Equipo de MongoDB por la base de datos
-   Comunidad de Express.js
