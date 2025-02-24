import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from '@utils/logger.js';
import connectDB from '@config/database.js';
import discordClient from '@config/discord.js';
import messageRoutes from '@routes/messageRoutes.js';
import channelRoutes from '@routes/channelRoutes.js';
import guildRoutes from '@routes/guildRoutes.js';
import { errorHandler, APIError } from '@middleware/errorHandler.js';
import { testBotConnection } from '@/services/messageService.js';
import swaggerUi from 'swagger-ui-express';
import { specs } from '@config/swagger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Mongo Db connection and Discord client connection
connectDB();
testBotConnection();
discordClient.connect();

const app = express();
const port = process.env.PORT || 3000;

// Habilitar confianza en proxies
app.enable('trust proxy');
app.set('trust proxy', true);

// CORS configuration
const allowedOrigins = [
	`http://localhost:${process.env.PORT || 4000}`,
	`http://localhost:3000`,
	process.env.BACKEND_URL,
	process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
		exposedHeaders: ['Content-Range', 'X-Content-Range'],
	})
);

app.use(express.static(path.join(__dirname, '../public')));

// Middleware para logging HTTP
app.use((req, res, next) => {
	const start = Date.now();

	res.on('finish', () => {
		const responseTime = Date.now() - start;
		logger.http(req, res, responseTime);
	});

	next();
});

app.use(express.json());

// Routes
app.get('/favicon.ico', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/favicon.ico'));
});

app.get('/', (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'Neural Msg API',
		version: '1.0.0',
		docs: '/api-docs',
		favicon: '/favicon.ico',
		endpoints: {
			messages: '/api/messages',
			channels: '/api/channels',
			guilds: '/api/guilds',
		},
	});
});
app.use('/api/messages', messageRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/guilds', guildRoutes);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Error handling
app.all('*', (req, res, next) => {
	next(new APIError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

app.listen(port, () => {
	logger.info(`Server running on port ${port}`);
});

export default app;
