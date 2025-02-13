export const messagePaths = {
	'/api/messages': {
		post: {
			summary: 'Create a new scheduled message',
			security: [{ BearerAuth: [] }],
			tags: ['Messages'],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/Message',
						},
						example: {
							content: 'Hello Discord!',
							scheduledFor: '2024-02-15T14:30:00Z',
							channelId: '123456789012345678',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Message created successfully',
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
										$ref: '#/components/schemas/Message',
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid input',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									status: {
										type: 'string',
										example: 'error',
									},
									message: {
										type: 'string',
										example: 'Message content is required',
									},
								},
							},
						},
					},
				},
				401: {
					description: 'Unauthorized - Invalid or missing API key',
				},
			},
		},
		get: {
			summary: 'Get all messages',
			security: [{ BearerAuth: [] }],
			tags: ['Messages'],
			responses: {
				200: {
					description: 'List of all messages',
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
											$ref: '#/components/schemas/Message',
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
	'/api/messages/pending': {
		get: {
			summary: 'Get all pending messages',
			security: [{ BearerAuth: [] }],
			tags: ['Messages'],
			responses: {
				200: {
					description: 'List of pending messages',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									status: {
										type: 'string',
										example: 'success',
									},
									results: { type: 'number', example: 1 },
									data: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Message',
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
	'/api/messages/sent': {
		get: {
			summary: 'Get all sent messages',
			security: [{ BearerAuth: [] }],
			tags: ['Messages'],
			responses: {
				200: {
					description: 'List of sent messages',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									status: {
										type: 'string',
										example: 'success',
									},
									results: { type: 'number', example: 1 },
									data: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Message',
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
	'/api/messages/{id}': {
		get: {
			summary: 'Get a specific message',
			security: [{ BearerAuth: [] }],
			tags: ['Messages'],
			parameters: [
				{
					in: 'path',
					name: 'id',
					required: true,
					schema: { type: 'string' },
					description: 'Message ID',
				},
			],
			responses: {
				200: {
					description: 'Message found',
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
										$ref: '#/components/schemas/Message',
									},
								},
							},
						},
					},
				},
				404: { description: 'Message not found' },
			},
		},
		patch: {
			summary: 'Update a message',
			security: [{ BearerAuth: [] }],
			tags: ['Messages'],
			parameters: [
				{
					in: 'path',
					name: 'id',
					required: true,
					schema: { type: 'string' },
					description: 'Message ID to update',
				},
			],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								content: { type: 'string' },
								scheduledFor: {
									type: 'string',
									format: 'date-time',
								},
								channelId: { type: 'string' },
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Message updated successfully',
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
										$ref: '#/components/schemas/Message',
									},
								},
							},
						},
					},
				},
				400: { description: 'Invalid input or message already sent' },
				404: { description: 'Message not found' },
			},
		},
		delete: {
			summary: 'Delete a message',
			security: [{ BearerAuth: [] }],
			tags: ['Messages'],
			parameters: [
				{
					in: 'path',
					name: 'id',
					required: true,
					schema: { type: 'string' },
					description: 'Message ID to delete',
				},
			],
			responses: {
				204: { description: 'Message deleted successfully' },
				400: { description: 'Cannot delete sent message' },
				404: { description: 'Message not found' },
			},
		},
	},
};
