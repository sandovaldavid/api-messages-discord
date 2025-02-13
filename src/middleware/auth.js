import crypto from 'crypto';
import { APIError } from './errorHandler.js';
import logger from '../utils/logger.js';

const API_KEY = process.env.API_KEY;
const API_KEY_SALT = process.env.API_KEY_SALT;

export const generateApiKey = () => {
	const randomBytes = crypto.randomBytes(32);
	const timestamp = Date.now().toString();
	const salt = crypto.randomBytes(16).toString('hex');

	// Generar el hash del token
	const hash = crypto
		.createHash('sha256')
		.update(randomBytes + timestamp + salt)
		.digest('hex');

	logger.info('New API key generated');

	return {
		token: hash,
		salt: salt,
		expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
	};
};

const verifyToken = (token, salt) => {
	return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(API_KEY));
};

export const authenticate = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new APIError('Invalid authorization', 401);
		}

		const token = authHeader.split(' ')[1];

		if (!token || !API_KEY_SALT) {
			throw new APIError('Invalid credentials', 401);
		}

		// Usar comparación segura contra timing attacks
		if (!verifyToken(token, API_KEY_SALT)) {
			throw new APIError('Invalid API key', 401);
		}

		logger.info(`Authenticated request from ${req.ip}`);
		next();
	} catch (error) {
		logger.error(`Authentication failed: ${error.message}`);
		next(error);
	}
};
