import logger from '../utils/logger.js';

// Customized error class
export class APIError extends Error {
	constructor(message, statusCode = 500) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true; // Para distinguir errores operacionales de programación
		Error.captureStackTrace(this, this.constructor);
	}
}

// Specific error types to Discord API
export class DiscordError extends APIError {
	constructor(message) {
		super(message, 503); // Service Unavailable
		this.name = 'DiscordError';
	}
}

// Error to indicate a resource was not found
export class NotFoundError extends APIError {
	constructor(resource = 'Resource') {
		super(`${resource} not found`, 404);
		this.name = 'NotFoundError';
	}
}

export const errorHandler = (err, req, res) => {
	err.statusCode = err.statusCode || 500;
	res.locals.error = err.message;

	// Log type of error
	if (err.statusCode >= 500) {
		logger.error(`${err.name}: ${err.message}\n${err.stack || ''}`);
	} else if (err.name === 'DiscordError') {
		logger.error(`Discord API Error: ${err.message}`);
	} else {
		logger.error(`${err.name}: ${err.message}`);
	}

	// Mongoose CastError
	if (err.name === 'ValidationError') {
		err.statusCode = 400;
		err.message = Object.values(err.errors)
			.map((e) => e.message)
			.join(', ');
	}

	if (err.name === 'CastError') {
		err.statusCode = 400;
		err.message = `Invalid ${err.path}: ${err.value}`;
	}

	const errorResponse = {
		status: err.status || 'error',
		statusCode: err.statusCode,
		message: err.message,
		...(process.env.NODE_ENV === 'development' && {
			stack: err.stack,
			error: err,
		}),
	};

	res.status(err.statusCode).json(errorResponse);
};
