import { messageSchema } from './schemas/message.schema.js';
import { channelSchema } from './schemas/channel.schema.js';
import { messagePaths } from './paths/message.paths.js';
import { channelPaths } from './paths/channel.paths.js';

export const swaggerConfig = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Discord Messages API',
			version: '1.0.0',
			description: 'API for scheduling and managing Discord messages',
		},
		servers: [
			{
				url: 'http://localhost:4000',
				description: 'Development server',
			},
		],
		components: {
			schemas: {
				...messageSchema,
				...channelSchema,
			},
			securitySchemes: {
				BearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [
			{
				BearerAuth: [],
			},
		],
		paths: {
			...messagePaths,
			...channelPaths,
		},
	},
	apis: [],
};

export const schemas = {
	messageSchema,
	channelSchema,
};

export const paths = {
	messagePaths,
	channelPaths,
};
