export const messageSchema = {
	Message: {
		type: 'object',
		required: ['content', 'scheduledFor', 'channelId'],
		properties: {
			_id: {
				type: 'string',
				description: 'Unique identifier for the message',
				example: '65cb7a8d1c3c8e001a123456',
			},
			content: {
				type: 'string',
				description: 'The message content',
				maxLength: 2000,
				example: 'Hello Discord!',
			},
			scheduledFor: {
				type: 'string',
				format: 'date-time',
				description: 'When the message should be sent',
				example: '2024-02-15T14:30:00Z',
			},
			channelId: {
				type: 'string',
				description:
					'Discord channel ID where the message will be sent',
				example: '123456789012345678',
			},
			sent: {
				type: 'boolean',
				description: 'Whether the message has been sent',
				default: false,
				example: false,
			},
			createdAt: {
				type: 'string',
				format: 'date-time',
				description: 'Timestamp when the message was created',
				example: '2024-02-13T10:00:00Z',
			},
			updatedAt: {
				type: 'string',
				format: 'date-time',
				description: 'Timestamp when the message was last updated',
				example: '2024-02-13T10:00:00Z',
			},
			formattedScheduledFor: {
				type: 'string',
				description: 'Human-readable formatted scheduled date',
				example: 'Thursday, February 15, 2024, 02:30 PM',
			},
		},
	},
};
