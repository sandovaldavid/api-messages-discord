import logger from '../utils/logger.js';
import { DiscordError, NotFoundError } from '../middleware/errorHandler.js';
import discordClient from '../config/discord.js';

class DiscordService {
	// Message Management
	async sendMessage(channelId, content) {
		try {
			const channel = await discordClient.client.channels.fetch(
				channelId
			);
			if (!channel) {
				throw new NotFoundError('Discord channel');
			}

			const message = await channel.send(content);
			logger.info(`Message sent to channel ${channelId}: ${message.id}`);
			return message.id;
		} catch (error) {
			logger.error(`Error sending message: ${error.message}`);
			throw new DiscordError(`Failed to send message: ${error.message}`);
		}
	}

	async editMessage(channelId, messageId, newContent) {
		try {
			const channel = await discordClient.client.channels.fetch(
				channelId
			);
			const message = await channel.messages.fetch(messageId);
			await message.edit(newContent);
			logger.info(`Message ${messageId} edited successfully`);
		} catch (error) {
			throw new DiscordError(`Failed to edit message: ${error.message}`);
		}
	}

	// Channel Management
	async archiveChannel(channelId) {
		try {
			const channel = await discordClient.client.channels.fetch(
				channelId
			);

			if (!channel) {
				throw new NotFoundError('Discord channel');
			}

			const botMember = channel.guild.members.me;
			if (
				!botMember?.permissions.has(['MANAGE_CHANNELS', 'MANAGE_ROLES'])
			) {
				throw new DiscordError('Bot missing required permissions');
			}

			let archivedCategory = channel.guild.channels.cache.find(
				(c) => c.name.toLowerCase() === 'archived' && c.type === 4
			);

			if (!archivedCategory) {
				archivedCategory = await channel.guild.channels.create({
					name: 'Archived',
					type: 4,
					position: 999,
					permissionOverwrites: [
						{
							id: channel.guild.roles.everyone.id,
							deny: ['VIEW_CHANNEL'],
						},
					],
				});
			}

			await channel.setParent(archivedCategory.id, {
				lockPermissions: false,
			});

			await channel.permissionOverwrites.set([
				{
					id: channel.guild.roles.everyone.id,
					deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
				},
			]);

			await channel.setName(`archived-${channel.name}`);

			logger.info(`Channel ${channelId} has been archived`);

			return {
				id: channel.id,
				name: channel.name,
				type: channel.type,
				archived: true,
				categoryId: archivedCategory.id,
			};
		} catch (error) {
			logger.error(`Failed to archive channel: ${error.message}`);
			throw new DiscordError(
				`Failed to archive channel: ${error.message}`
			);
		}
	}

	async hideChannel(channelId, hidden = true) {
		try {
			const channel = await discordClient.client.channels.fetch(
				channelId
			);
			if (!channel) {
				throw new NotFoundError('Discord channel');
			}

			const botMember = channel.guild.members.me;
			if (
				!botMember?.permissions.has(['MANAGE_CHANNELS', 'MANAGE_ROLES'])
			) {
				throw new DiscordError('Bot missing required permissions');
			}

			const everyoneRole = channel.guild.roles.everyone;

			await channel.permissionOverwrites.edit(everyoneRole, {
				VIEW_CHANNEL: !hidden,
				SEND_MESSAGES: !hidden,
			});

			logger.info(`Channel ${channelId} visibility set to ${!hidden}`);

			return {
				id: channel.id,
				name: channel.name,
				type: channel.type,
				hidden: hidden,
				visible: !hidden,
			};
		} catch (error) {
			logger.error(
				`Failed to update channel visibility: ${error.message}`
			);
			throw new DiscordError(
				`Failed to update channel visibility: ${error.message}`
			);
		}
	}

	async getChannelInfo(channelId) {
		try {
			const channel = await discordClient.client.channels.fetch(
				channelId
			);
			return {
				id: channel.id,
				name: channel.name,
				type: channel.type,
				guildId: channel.guild.id,
				guildName: channel.guild.name,
			};
		} catch (error) {
			throw new DiscordError(
				`Failed to fetch channel info: ${error.message}`
			);
		}
	}

	async getAllGuildChannels(guildId) {
		try {
			const guild = await discordClient.client.guilds.fetch(guildId);
			const channels = await guild.channels.fetch();
			return channels
				.filter((channel) => channel.type === 0)
				.map((channel) => ({
					id: channel.id,
					name: channel.name,
					type: channel.type,
				}));
		} catch (error) {
			throw new DiscordError(
				`Failed to fetch guild channels: ${error.message}`
			);
		}
	}

	// Guild Management
	async getGuildInfo(guildId) {
		try {
			if (guildId) {
				const guild = await discordClient.client.guilds.fetch(guildId);
				return {
					id: guild.id,
					name: guild.name,
					memberCount: guild.memberCount,
					owner: guild.ownerId,
				};
			}

			const guilds = await discordClient.client.guilds.fetch();
			return Array.from(guilds.values()).map((guild) => ({
				id: guild.id,
				name: guild.name,
				memberCount: guild.memberCount,
				owner: guild.ownerId,
			}));
		} catch (error) {
			throw new DiscordError(
				`Failed to fetch guild info: ${error.message}`
			);
		}
	}
}

const discordService = new DiscordService();
export default discordService;
