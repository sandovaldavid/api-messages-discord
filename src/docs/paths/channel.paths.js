export const channelPaths = {
	'/api/channels': {
		get: {
			summary: 'Get all available channels',
			description: 'Retrieves all channels with optional filtering by type and active status',
			security: [{ BearerAuth: [] }],
			tags: ['Channels'],
			parameters: [
				{
					in: 'query',
					name: 'type',
					schema: { type: 'string', enum: ['text'] },
					description: 'Filter channels by type',
				},
				{
					in: 'query',
					name: 'active',
					schema: { type: 'boolean' },
					description: 'Filter by active status',
				},
				{
					in: 'query',
					name: 'guildId',
					schema: { type: 'string' },
					description: 'Filter channels by guild ID',
				},
			],
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
									results: { type: 'number', example: 2 },
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
				404: { description: 'No channels found' },
			},
		},
	},
	'/api/channels/{channelId}': {
		get: {
			summary: 'Get channel by ID',
			description: 'Retrieves detailed information about a specific channel',
			security: [{ BearerAuth: [] }],
			tags: ['Channels'],
			parameters: [
				{
					in: 'path',
					name: 'channelId',
					required: true,
					schema: { type: 'string' },
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
										type: 'object',
										properties: {
											properties: {
												// Use the channel properties directly
												channelId: {
													type: 'string',
													description: 'Discord channel ID',
												},
												name: {
													type: 'string',
													description: 'Channel name',
												},
												guildId: {
													type: 'string',
													description: 'Discord server ID',
												},
												guildName: {
													type: 'string',
													description: 'Discord server name',
												},
												type: {
													type: 'number',
													description: 'Channel type',
												},
												isActive: {
													type: 'boolean',
													description: 'Channel active status',
												},
												types: {
													type: 'object',
													properties: {
														isText: {
															type: 'boolean',
														},
														isVoice: {
															type: 'boolean',
														},
														isCategory: {
															type: 'boolean',
														},
														isNews: {
															type: 'boolean',
														},
														typeLabel: {
															type: 'string',
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid channel ID format',
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
	'/api/channels/sync': {
		get: {
			summary: 'Synchronize channels with Discord',
			description: 'Synchronizes all channels from Discord with the local database',
			security: [{ BearerAuth: [] }],
			tags: ['Channels'],
			responses: {
				200: {
					description: 'Channels synchronized successfully',
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
									details: {
										type: 'object',
										properties: {
											matched: { type: 'number' },
											modified: { type: 'number' },
											upserted: { type: 'number' },
											activeChannels: { type: 'number' },
											textChannels: { type: 'number' },
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
	'/api/channels/text': {
		get: {
			summary: 'Get text channels only',
			description: 'Retrieves all text channels',
			security: [{ BearerAuth: [] }],
			tags: ['Channels'],
			responses: {
				200: {
					description: 'Text channels retrieved successfully',
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
			},
		},
	},
	'/api/channels/guild/{guildId}': {
		get: {
			summary: 'Get channels by guild',
			description: 'Retrieves all channels for a specific guild',
			security: [{ BearerAuth: [] }],
			tags: ['Channels'],
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
									data: {
										type: 'object',
										properties: {
											guild: {
												type: 'object',
												properties: {
													id: { type: 'string' },
													name: { type: 'string' },
													memberCount: {
														type: 'number',
													},
												},
											},
											channels: {
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
					},
				},
				404: { description: 'Guild not found' },
			},
		},
	},
	'/api/channels/{channelId}/status': {
		patch: {
			summary: 'Update channel status',
			description: 'Update the active status of a channel and optionally archive or hide it',
			security: [{ BearerAuth: [] }],
			tags: ['Channels'],
			parameters: [
				{
					in: 'path',
					name: 'channelId',
					required: true,
					schema: { type: 'string' },
					description: 'Discord channel ID',
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
								action: {
									type: 'string',
									enum: ['hide', 'archive'],
									description: 'Action to perform when deactivating',
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Channel status updated successfully',
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
										$ref: '#/components/schemas/Channel',
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid input or missing required fields',
				},
				404: { description: 'Channel not found' },
				503: { description: 'Discord service unavailable' },
			},
		},
	},
};
