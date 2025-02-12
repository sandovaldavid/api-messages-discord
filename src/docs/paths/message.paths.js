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
			summary: 'Get all scheduled messages',
			security: [{ BearerAuth: [] }],
			tags: ['Messages'],
			responses: {
				200: {
					description: 'List of messages retrieved successfully',
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
										description: 'Number of messages found',
										example: 2,
									},
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
				401: {
					description: 'Unauthorized - Invalid or missing API key',
				},
			},
		},
	},
	'/api/messages/{id}': {
		delete: {
			summary: 'Delete a scheduled message',
			security: [{ BearerAuth: [] }],
			tags: ['Messages'],
			parameters: [
				{
					in: 'path',
					name: 'id',
					required: true,
					schema: {
						type: 'string',
					},
					description: 'Message ID to delete',
				},
			],
			responses: {
				204: {
					description: 'Message deleted successfully',
				},
				400: {
					description:
						'Invalid message ID format or message already sent',
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
										example:
											'Cannot delete already sent message',
									},
								},
							},
						},
					},
				},
				401: {
					description: 'Unauthorized - Invalid or missing API key',
				},
				404: {
					description: 'Message not found',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									status: {
										type: 'string',
										example: 'fail',
									},
									message: {
										type: 'string',
										example: 'Message not found',
									},
								},
							},
						},
					},
				},
			},
		},
	},
};
