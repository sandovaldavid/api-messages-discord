import express from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import connectDB from './config/database.js';
import discordClient from './config/discord.js';
import messageRoutes from './routes/messageRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import guildRoutes from './routes/guildRoutes.js';
import { errorHandler, APIError } from './middleware/errorHandler.js';
import { testBotConnection } from './services/messagueService.js';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';

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

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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
app.use('/api/messages', messageRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/guilds', guildRoutes);

// Error handling
app.all('*', (req, res, next) => {
	next(new APIError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

app.listen(port, () => {
	logger.info(`Server running on port ${port}`);
});

export default app;
