import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	res.locals.error = err.message;

	if (statusCode >= 500) {
		logger.error(`${err.message} ${err.stack || ''}`);
	} else {
		logger.error(`${err.message}`);
	}

	const errorResponse = {
		status: 'error',
		statusCode,
		message: err.message || 'Internal Server Error',
		...(process.env.NODE_ENV === 'development' &&
			statusCode >= 500 && {
				stack: err.stack,
			}),
	};

	res.status(statusCode).json(errorResponse);
};

// Customized error class
export class APIError extends Error {
	constructor(message, statusCode = 500) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		Error.captureStackTrace(this, this.constructor);
	}
}
