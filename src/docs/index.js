import { messageSchema } from './schemas/message.schema.js';
import { channelSchema } from './schemas/channel.schema.js';
import { messagePaths } from './paths/message.paths.js';
import { channelPaths } from './paths/channel.paths.js';
import { guildSchema } from './schemas/guild.schema.js';
import { guildPaths } from './paths/guild.paths.js';

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
				url:
					process.env.NODE_ENV === 'production'
						? 'https://api-neural-msg.devprojects.tech'
						: `http://localhost:${process.env.PORT || 4000}`,
				description:
					process.env.NODE_ENV === 'production'
						? 'Production server'
						: 'Development server',
			},
		],
		components: {
			schemas: {
				...messageSchema,
				...channelSchema,
				...guildSchema,
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
			...guildPaths,
		},
	},
	apis: [],
};

export const schemas = {
	messageSchema,
	channelSchema,
	guildSchema,
};

export const paths = {
	messagePaths,
	channelPaths,
};
