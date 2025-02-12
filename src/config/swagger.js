import swaggerJsdoc from 'swagger-jsdoc';

const options = {
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
	},
	apis: ['./src/routes/*.js'],
};

export const specs = swaggerJsdoc(options);
