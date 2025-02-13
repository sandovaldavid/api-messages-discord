# Desplegando Neural Msg en Heroku 🚀

Esta guía explica cómo desplegar la API Neural Msg - Discord Scheduled Messages en Heroku usando Docker.

## Requisitos Previos

-   CLI de Heroku instalado (`npm install -g heroku`)
-   Docker instalado
-   Repositorio Git inicializado
-   Todos los archivos del proyecto, incluyendo:
    -   Dockerfile
    -   heroku.yml
    -   .dockerignore

## Despliegue Paso a Paso 📋

### 1. Iniciar Sesión en Heroku

```bash
heroku login
```

### 2. Crear Aplicación en Heroku

```bash
heroku create api-messages-discord
```

### 3. Establecer Stack a Container

```bash
heroku stack:set container
```

### 4. Configurar Variables de Entorno 🔐

Configura todas las variables de entorno requeridas en Heroku:

```bash
heroku config:set MONGODB_URI=tu_uri_mongodb
heroku config:set DISCORD_TOKEN=tu_token_bot_discord
heroku config:set DISCORD_CHANNEL_ID=tu_id_canal
heroku config:set API_KEY=tu_api_key
heroku config:set API_KEY_SALT=tu_api_key_salt
heroku config:set CHUNK_SIZE=100
```

### 5. Desplegar Aplicación 🚀

Sube el código a Heroku:

```bash
git push heroku main
```

### 6. Verificar Despliegue

```bash
heroku logs --tail
```

### 7. Escalar Dynos (si es necesario)

```bash
heroku ps:scale web=1
```

## Archivos de Configuración 📄

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

## Notas Importantes 📝

1. **Variables de Entorno**: Asegúrate de que todos los datos sensibles estén configurados en Heroku y no comprometidos en el repositorio.

2. **Registros**: El sistema de archivos de Heroku es efímero. Los registros en el directorio logs no persistirán. Usa el sistema de registros de Heroku:

    ```bash
    heroku logs --tail
    ```

3. **MongoDB**: Usa MongoDB Atlas u otro proveedor en la nube para la base de datos.

4. **Bot de Discord**: Asegúrate de que tu bot de Discord esté correctamente configurado y tenga los permisos necesarios.

## Monitoreo y Mantenimiento 🔍

### Ver Registros

```bash
heroku logs --tail
```

### Verificar Estado de la Aplicación

```bash
heroku ps
```

### Reiniciar Aplicación

```bash
heroku restart
```

## Solución de Problemas 🔧

1. Si la aplicación falla, revisa los registros:

```bash
heroku logs --tail
```

2. Si faltan variables de entorno:

```bash
heroku config
```

3. Para ejecutar la aplicación en modo mantenimiento:

```bash
heroku maintenance:on
```

4. Para verificar los registros de construcción:

```bash
heroku builds:info
```

## Recursos Adicionales 📚

-   [Despliegue Docker en Heroku](https://devcenter.heroku.com/articles/container-registry-and-runtime)
-   [Comandos CLI de Heroku](https://devcenter.heroku.com/articles/heroku-cli-commands)
-   [Registros en Heroku](https://devcenter.heroku.com/articles/logging)
-   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
