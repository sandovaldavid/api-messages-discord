export const channelSchema = {
	Channel: {
		type: 'object',
		required: ['channelId', 'name', 'guildId', 'guildName', 'type'],
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
				description: 'Channel type',
				enum: [0, 1, 2, 3, 4, 5],
				default: 0,
				example: 0,
			},
			types: {
				type: 'object',
				description: 'Channel type information',
				properties: {
					isText: {
						type: 'boolean',
						description:
							'Whether the channel is a text channel (type 0)',
						example: true,
					},
					isVoice: {
						type: 'boolean',
						description:
							'Whether the channel is a voice channel (type 2)',
						example: false,
					},
					isCategory: {
						type: 'boolean',
						description:
							'Whether the channel is a category (type 4)',
						example: false,
					},
					isNews: {
						type: 'boolean',
						description:
							'Whether the channel is a news channel (type 5)',
						example: false,
					},
					typeLabel: {
						type: 'string',
						description: 'Human-readable channel type',
						enum: [
							'text',
							'dm',
							'voice',
							'group',
							'category',
							'news',
							'unknown',
						],
						example: 'text',
					},
				},
			},
			isActive: {
				type: 'boolean',
				description: 'Whether the channel is active',
				default: true,
				example: true,
			},
			isInactive: {
				type: 'boolean',
				description: 'Whether the channel is inactive (virtual field)',
				example: false,
			},
			displayName: {
				type: 'string',
				description:
					'Formatted channel name including guild (virtual field)',
				example: 'My Discord Server > general',
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
