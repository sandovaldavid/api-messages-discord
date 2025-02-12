export const channelSchema = {
	Channel: {
		type: 'object',
		required: ['channelId', 'name', 'guildId', 'guildName'],
		properties: {
			channelId: {
				type: 'string',
				description: 'Discord channel ID',
				example: '123456789012345678',
			},
			name: {
				type: 'string',
				description: 'Channel name',
				example: 'general',
			},
			guildId: {
				type: 'string',
				description: 'Discord server (guild) ID',
				example: '987654321098765432',
			},
			guildName: {
				type: 'string',
				description: 'Discord server name',
				example: 'My Discord Server',
			},
			type: {
				type: 'number',
				description: 'Channel type (0 for text channels)',
				default: 0,
				example: 0,
			},
			isActive: {
				type: 'boolean',
				description: 'Whether the channel is active',
				default: true,
				example: true,
			},
			createdAt: {
				type: 'string',
				format: 'date-time',
				description: 'When the channel was created',
				example: '2024-02-12T00:00:00.000Z',
			},
			updatedAt: {
				type: 'string',
				format: 'date-time',
				description: 'When the channel was last updated',
				example: '2024-02-12T00:00:00.000Z',
			},
		},
	},
};
