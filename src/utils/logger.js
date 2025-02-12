import winston from 'winston';
const { combine, timestamp, colorize, printf } = winston.format;

// Función para colorear según código HTTP
const getStatusColor = (status) => {
	if (status >= 500) return '\x1b[31m'; // Rojo para errores del servidor
	if (status >= 400) return '\x1b[33m'; // Amarillo para errores del cliente
	if (status >= 300) return '\x1b[36m'; // Cyan para redirecciones
	if (status >= 200) return '\x1b[32m'; // Verde para éxito
	return '\x1b[37m'; // Blanco para otros
};

const httpFormat = printf(
	({
		timestamp,
		level,
		message,
		method,
		url,
		status,
		responseTime,
		ip,
		userAgent,
		route,
		error,
	}) => {
		const reset = '\x1b[0m';

		if (method && url) {
			const statusColor = getStatusColor(status);
			const routeInfo = route ? `[${route}] ` : '';
			const errorInfo = error ? `\n\x1b[31mError: ${error}${reset}` : '';

			return (
				`${timestamp} ${statusColor}[${level}]${reset} ` +
				`${ip} "${method} ${url}" ` +
				`${routeInfo}` +
				`${statusColor}${status}${reset} ` +
				`\x1b[35m${responseTime}ms${reset} ` +
				`"${userAgent}"` +
				`${errorInfo}`
			);
		}
		return `${timestamp} [${level}] ${message}`;
	}
);

const logger = winston.createLogger({
	level: 'http',
	format: combine(
		timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		colorize(),
		httpFormat
	),
	transports: [
		new winston.transports.Console({
			format: combine(colorize(), httpFormat),
		}),
		new winston.transports.File({
			filename: 'logs/error.log',
			level: 'error',
			format: combine(
				timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				httpFormat
			),
		}),
		new winston.transports.File({
			filename: 'logs/http.log',
			level: 'http',
			format: combine(
				timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				httpFormat
			),
		}),
		new winston.transports.File({
			filename: 'logs/combined.log',
		}),
	],
});

logger.http = (req, res, responseTime) => {
	const route = req.route ? req.route.path : '';
	const error = res.locals.error || '';

	logger.log({
		level: 'http',
		method: req.method,
		url: req.originalUrl || req.url,
		status: res.statusCode,
		responseTime,
		ip: req.ip || req.connection.remoteAddress,
		userAgent: req.get('user-agent') || '-',
		route,
		error,
		message: '',
	});
};

export default logger;
