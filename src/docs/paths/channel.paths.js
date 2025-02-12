export const channelPaths = {
	'/api/channels': {
		get: {
			summary: 'Get all available text channels',
			security: [{ BearerAuth: [] }],
			tags: ['Channels'],
			responses: {
				200: {
					description: 'List of channels retrieved successfully',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									status: {
										type: 'string',
										example: 'success',
									},
									results: {
										type: 'number',
										description: 'Number of channels found',
										example: 2,
									},
									data: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Channel',
										},
									},
								},
							},
						},
					},
				},
				401: {
					description: 'Unauthorized - Invalid or missing API key',
				},
				503: {
					description: 'Discord service unavailable',
				},
			},
		},
	},
	'/api/channels/{channelId}': {
		get: {
			summary: 'Get channel by ID',
			security: [{ BearerAuth: [] }],
			tags: ['Channels'],
			parameters: [
				{
					in: 'path',
					name: 'channelId',
					required: true,
					schema: {
						type: 'string',
					},
					description: 'Discord channel ID',
				},
			],
			responses: {
				200: {
					description: 'Channel details retrieved successfully',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									status: {
										type: 'string',
										example: 'success',
									},
									data: {
										$ref: '#/components/schemas/Channel',
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid channel ID or not a text channel',
				},
				401: {
					description: 'Unauthorized - Invalid or missing API key',
				},
				404: {
					description: 'Channel not found',
				},
				503: {
					description: 'Discord service unavailable',
				},
			},
		},
	},
};
