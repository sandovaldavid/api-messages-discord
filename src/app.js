import express from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import { errorHandler, APIError } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para loggear peticiones HTTP
app.use((req, res, next) => {
	const start = Date.now();

	app.set('trust proxy', true);

	res.on('finish', () => {
		const responseTime = Date.now() - start;
		logger.http(req, res, responseTime);
	});

	next();
});

app.use(express.json());

app.get('/', (req, res) => {
	res.json({ message: 'Discord Messages API' });
});

app.all('*', (req, res, next) => {
	next(new APIError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Middleware de manejo de errores
app.use(errorHandler);

app.listen(port, () => {
	logger.info(`Server running on port ${port}`);
});

export default app;
