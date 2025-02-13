export const guildPaths = {
	'/api/guilds': {
		get: {
			summary: 'Get all guilds',
			description: 'Retrieves all active Discord guilds/servers',
			security: [{ BearerAuth: [] }],
			tags: ['Guilds'],
			responses: {
				200: {
					description: 'List of guilds retrieved successfully',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									status: {
										type: 'string',
										example: 'success',
									},
									results: { type: 'number', example: 2 },
									data: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Guild',
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
				503: { description: 'Discord service unavailable' },
			},
		},
	},
	'/api/guilds/sync': {
		get: {
			summary: 'Synchronize guilds with Discord',
			description: 'Synchronizes all guilds and their channels from Discord with the local database',
			security: [{ BearerAuth: [] }],
			tags: ['Guilds'],
			responses: {
				200: {
					description: 'Guilds synchronized successfully',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									status: {
										type: 'string',
										example: 'success',
									},
									message: { type: 'string' },
									data: {
										type: 'object',
										properties: {
											created: { type: 'number' },
											updated: { type: 'number' },
											failed: { type: 'number' },
										},
									},
								},
							},
						},
					},
				},
				503: { description: 'Discord service unavailable' },
			},
		},
	},
	'/api/guilds/{guildId}': {
		get: {
			summary: 'Get guild by ID',
			description: 'Retrieves detailed information about a specific Discord guild/server',
			security: [{ BearerAuth: [] }],
			tags: ['Guilds'],
			parameters: [
				{
					in: 'path',
					name: 'guildId',
					required: true,
					schema: { type: 'string' },
					description: 'Discord guild ID',
				},
			],
			responses: {
				200: {
					description: 'Guild details retrieved successfully',
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
										$ref: '#/components/schemas/Guild',
									},
								},
							},
						},
					},
				},
				404: { description: 'Guild not found' },
			},
		},
	},
	'/api/guilds/{guildId}/channels': {
		get: {
			summary: 'Get guild channels',
			description: 'Retrieves all channels for a specific guild',
			security: [{ BearerAuth: [] }],
			tags: ['Guilds'],
			parameters: [
				{
					in: 'path',
					name: 'guildId',
					required: true,
					schema: { type: 'string' },
					description: 'Discord guild ID',
				},
			],
			responses: {
				200: {
					description: 'Guild channels retrieved successfully',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									status: {
										type: 'string',
										example: 'success',
									},
									results: { type: 'number' },
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
				404: { description: 'Guild not found' },
			},
		},
	},
	'/api/guilds/{guildId}/status': {
		get: {
			summary: 'Get guild status',
			description: 'Retrieves the current status of a guild both locally and on Discord',
			security: [{ BearerAuth: [] }],
			tags: ['Guilds'],
			parameters: [
				{
					in: 'path',
					name: 'guildId',
					required: true,
					schema: { type: 'string' },
					description: 'Discord guild ID',
				},
			],
			responses: {
				200: {
					description: 'Guild status retrieved successfully',
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
										$ref: '#/components/schemas/GuildStatus',
									},
								},
							},
						},
					},
				},
				404: { description: 'Guild not found' },
			},
		},
		patch: {
			summary: 'Update guild status',
			description: 'Updates the active status of a guild',
			security: [{ BearerAuth: [] }],
			tags: ['Guilds'],
			parameters: [
				{
					in: 'path',
					name: 'guildId',
					required: true,
					schema: { type: 'string' },
					description: 'Discord guild ID',
				},
			],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['isActive'],
							properties: {
								isActive: {
									type: 'boolean',
									description: 'New active status',
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Guild status updated successfully',
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
										$ref: '#/components/schemas/Guild',
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid input or missing required fields',
				},
				404: { description: 'Guild not found' },
			},
		},
	},
};
