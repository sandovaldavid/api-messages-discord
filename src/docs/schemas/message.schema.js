export const messageSchema = {
	Message: {
		type: 'object',
		required: ['content', 'scheduledFor', 'channelId'],
		properties: {
			content: {
				type: 'string',
				description: 'The message content',
			},
			scheduledFor: {
				type: 'string',
				format: 'date-time',
				description: 'When the message should be sent',
			},
			channelId: {
				type: 'string',
				description: 'Discord channel ID',
			},
			sent: {
				type: 'boolean',
				description: 'Whether the message has been sent',
			},
		},
	},
};
