export const guildSchema = {
	Guild: {
		type: 'object',
		required: ['guildId', 'name', 'memberCount', 'ownerId'],
		properties: {
			guildId: {
				type: 'string',
				description: 'Unique Discord guild/server ID',
				example: '123456789012345678',
			},
			name: {
				type: 'string',
				description: 'Guild/server name',
				example: 'My Discord Server',
			},
			memberCount: {
				type: 'number',
				description: 'Number of members in the guild',
				minimum: 0,
				default: 0,
				example: 100,
			},
			ownerId: {
				type: 'string',
				description: 'Discord ID of the guild owner',
				example: '987654321098765432',
			},
			isActive: {
				type: 'boolean',
				description: 'Whether the guild is active in the system',
				default: true,
				example: true,
			},
			icon: {
				type: 'string',
				description: 'Guild icon URL or hash',
				nullable: true,
				example: 'abc123def456',
			},
			description: {
				type: 'string',
				description: 'Guild description',
				maxLength: 1000,
				nullable: true,
				example: 'A great Discord server for our community',
			},
			region: {
				type: 'string',
				description: 'Guild region/location',
				nullable: true,
				example: 'us-west',
			},
			channels: {
				type: 'array',
				description: 'List of channels in the guild',
				items: {
					$ref: '#/components/schemas/Channel',
				},
			},
			createdAt: {
				type: 'string',
				format: 'date-time',
				description: 'When the guild was created in the system',
				example: '2024-02-13T10:00:00Z',
			},
			updatedAt: {
				type: 'string',
				format: 'date-time',
				description: 'When the guild was last updated',
				example: '2024-02-13T10:00:00Z',
			},
			shortDescription: {
				type: 'string',
				description: 'Truncated description (virtual field)',
				example: 'A great Discord server...',
			},
			summary: {
				type: 'string',
				description: 'Guild summary with formatted member count',
				example: 'My Discord Server - 1,000 members',
			},
		},
	},
	GuildStatus: {
		type: 'object',
		properties: {
			guildId: {
				type: 'string',
				description: 'Discord guild ID',
			},
			name: {
				type: 'string',
				description: 'Guild name',
			},
			isActive: {
				type: 'boolean',
				description: 'Local active status',
			},
			memberCount: {
				type: 'number',
				description: 'Current member count',
			},
			lastUpdated: {
				type: 'string',
				format: 'date-time',
				description: 'Last update timestamp',
			},
			discordStatus: {
				type: 'object',
				properties: {
					available: {
						type: 'boolean',
						description:
							'Whether the guild is available on Discord',
					},
					memberCount: {
						type: 'number',
						description: 'Current Discord member count',
					},
					owner: {
						type: 'boolean',
						description: 'Whether the bot has owner privileges',
					},
				},
			},
		},
	},
};
