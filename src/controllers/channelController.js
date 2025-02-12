import {
	APIError,
	DiscordError,
	NotFoundError,
} from '../middleware/errorHandler.js';
import discordClient from '../config/discord.js';
import logger from '../utils/logger.js';

export const getChannels = async (req, res, next) => {
	try {
		const guilds = await discordClient.client.guilds.fetch();

		if (!guilds || guilds.size === 0) {
			throw new DiscordError('No Discord servers found');
		}

		const channels = [];

		for (const [, guild] of guilds) {
			try {
				const guildChannels = await guild.channels.fetch();
				const textChannels = guildChannels.filter(
					(channel) => channel.type === 0
				);

				channels.push(
					...textChannels.map((channel) => ({
						id: channel.id,
						name: channel.name,
						guildName: guild.name,
						type: channel.type,
					}))
				);
			} catch (guildError) {
				logger.error(
					`Error fetching channels for guild ${guild.name}: ${guildError.message}`
				);
				continue;
			}
		}

		if (channels.length === 0) {
			throw new NotFoundError('Text channels');
		}

		res.status(200).json({
			status: 'success',
			results: channels.length,
			data: channels,
		});
	} catch (error) {
		if (error instanceof APIError) {
			next(error);
		} else {
			logger.error(`Error fetching channels: ${error.message}`);
			next(new DiscordError('Error fetching Discord channels'));
		}
	}
};

export const getChannelById = async (req, res, next) => {
	try {
		const { channelId } = req.params;

		if (!channelId) {
			throw new APIError('Channel ID is required', 400);
		}

		const channel = await discordClient.client.channels.fetch(channelId);

		if (!channel) {
			throw new NotFoundError('Channel');
		}

		if (channel.type !== 0) {
			throw new APIError('Channel is not a text channel', 400);
		}

		res.status(200).json({
			status: 'success',
			data: {
				id: channel.id,
				name: channel.name,
				type: channel.type,
				guildName: channel.guild.name,
			},
		});
	} catch (error) {
		if (error instanceof APIError) {
			next(error);
		} else if (error.code === 10003) {
			next(new NotFoundError('Channel'));
		} else {
			logger.error(`Discord API Error: ${error.message}`);
			next(new DiscordError(error.message));
		}
	}
};
