import { messageSchema } from '@docs/api/schemas/message.schema.js';
import { channelSchema } from '@docs/api/schemas/channel.schema.js';
import { messagePaths } from '@docs/api/paths/message.paths.js';
import { channelPaths } from '@docs/api/paths/channel.paths.js';
import { guildSchema } from '@docs/api/schemas/guild.schema.js';
import { guildPaths } from '@docs/api/paths/guild.paths.js';

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
				url: 'https://api-neural-msg.devprojects.tech',
				description: 'Production server',
			},
			{
				url: `http://localhost:${process.env.PORT || 4000}`,
				description: 'Development server',
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
