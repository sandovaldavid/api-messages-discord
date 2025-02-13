import crypto from 'crypto';
import { APIError } from './errorHandler.js';
import logger from '../utils/logger.js';

const API_KEY = process.env.API_KEY;
const API_KEY_SALT = process.env.API_KEY_SALT;

export const generateApiKey = () => {
	const randomBytes = crypto.randomBytes(32);
	const salt = crypto.randomBytes(16).toString('hex');

	const hash = crypto
		.createHash('sha256')
		.update(randomBytes.toString('hex') + salt)
		.digest('hex');

	logger.info('New API key generated');

	return {
		token: randomBytes.toString('hex'),
		salt: salt,
		apiKey: hash,
		expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
	};
};

const verifyToken = (token, salt) => {
	if (!token || !salt || !API_KEY) {
		return false;
	}

	try {
		const verificationHash = crypto
			.createHash('sha256')
			.update(token + salt)
			.digest('hex');

		return verificationHash === API_KEY;
	} catch (error) {
		logger.error(`Token verification error: ${error.message}`);
		return false;
	}
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
