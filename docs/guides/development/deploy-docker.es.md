# Desplegando Neural Msg Localmente con Docker 🐳

Esta guía explica cómo desplegar la API Neural Msg - Discord Scheduled Messages localmente usando Docker y Docker Compose.

## Prerrequisitos 📋

- Docker instalado
- Docker Compose instalado
- Repositorio Git clonado
- Archivos requeridos:
    - [`docker-compose.yml`](ocker-compose.yml)
    - [`docker/development/Dockerfile`](docker/development/Dockerfile)
    - [`.env`](.env.example)
    - [`.dockerignore`](.dockerignore)

## Estructura de Directorios 📁

```bash
proyecto-raiz/
├── docker/
│   └── development/
│       ├── docker-compose.yml
│       └── Dockerfile
├── docker-compose.yml
├── .env
└── .dockerignore
```

## Despliegue Paso a Paso 🚀

### 1. Configurar Variables de Entorno

Copia el archivo de entorno de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Variables requeridas en .env:

```env
PORT=4000
MONGODB_URI=mongodb://dev-neural-msg:123456@mongo:27017/neural-msg-dev?authSource=admin
DISCORD_TOKEN=tu_token_discord
DISCORD_CHANNEL_ID=tu_id_canal
API_KEY=tu_api_key
API_KEY_SALT=tu_api_key_salt
MONGO_USER=dev-neural-msg
MONGO_PASSWORD=123456
MONGO_DATABASE=neural-msg-dev
```

### 2. Archivos de Configuración Docker 🔧

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

### 3. Construir e Iniciar Servicios 🏗️

```bash
# Construir e iniciar contenedores
docker-compose up dev-api --build

# O ejecutar en modo desatendido
docker-compose up -d dev-api --build
```

### 4. Verificar Despliegue ✅

Comprobar si los servicios están ejecutándose:

```bash
docker-compose ps
```

Ver registros:

```bash
docker-compose logs -f dev-api
```

## Comandos de Gestión de Contenedores 🛠️

```bash
# Detener contenedores
docker-compose down

# Reiniciar contenedores
docker-compose restart

# Ver registros
docker-compose logs -f

# Acceder al shell del contenedor
docker-compose exec dev-api sh
```

## Problemas Comunes y Soluciones 🔍

1. **Problemas de Conexión MongoDB**

    ```bash
    # Verificar registros de MongoDB
    docker-compose logs dev-mongo
    ```

2. **API No Accesible**

    - Verificar mapeo de puertos
    - Comprobar estado del contenedor

    ```bash
    docker-compose ps
    ```

3. **Problemas de Permisos de Volúmenes**
    ```bash
    # Arreglar permisos
    sudo chown -R $USER:$USER .
    ```

## Monitoreo y Mantenimiento 📊

### Ver Estadísticas de Contenedores

```bash
docker stats
```

### Verificar Salud de Contenedores

```bash
docker-compose ps
```

### Ver Registros de la API

```bash
docker-compose logs -f dev-api
```

## Recursos Adicionales 📚

- [Documentación Docker](https://docs.docker.com/)
- [Documentación Docker Compose](https://docs.docker.com/compose/)
- [Documentación Bun](https://bun.sh/)

## Notas 📝

1. El entorno de desarrollo usa recarga en caliente
2. Los datos de MongoDB persisten en volumen nombrado
3. Los módulos de Node se almacenan en caché en volumen
4. Las variables de entorno se cargan desde .env

## Consideraciones de Seguridad 🔒

1. Nunca comitear datos sensibles a Git
2. Usar contraseñas fuertes para MongoDB
3. Mantener Docker y dependencias actualizadas
4. Seguir las mejores prácticas de seguridad para despliegues en producción
