import express from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para loggear peticiones HTTP
app.use((req, res, next) => {
	logger.info(`${req.method} ${req.url}`);
	next();
});

app.use(express.json());

app.get('/', (req, res) => {
	res.json({ message: 'Discord Messages API' });
});

app.listen(port, () => {
	logger.info(`Server running on port ${port}`);
});

export default app;
