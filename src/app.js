import express from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import connectDB from './config/database.js';
import discordClient from './config/discord.js';
import messageRoutes from './routes/messageRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import { errorHandler, APIError } from './middleware/errorHandler.js';
import { testBotConnection } from './services/messagueService.js';

dotenv.config();

// Mongo Db connection and Discord client connection
connectDB();
testBotConnection();
discordClient.connect();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/messages', messageRoutes);
app.use('/api/channels', channelRoutes);

// Error handling
app.all('*', (req, res, next) => {
	next(new APIError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

app.listen(port, () => {
	logger.info(`Server running on port ${port}`);
});

export default app;
