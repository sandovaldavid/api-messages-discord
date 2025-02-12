import { APIError } from '../middleware/errorHandler.js';
import discordClient from '../config/discord.js';
import logger from '../utils/logger.js';

export const getChannels = async (req, res, next) => {
	try {
		const guilds = await discordClient.client.guilds.fetch();
		const channels = [];

		for (const [, guild] of guilds) {
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
		}

		res.status(200).json({
			status: 'success',
			data: channels,
		});
	} catch (error) {
		logger.error(`Error fetching channels: ${error.message}`);
		next(new APIError('Error fetching Discord channels', 500));
	}
};

export const getChannelById = async (req, res, next) => {
	try {
		const { channelId } = req.params;
		const channel = await discordClient.client.channels.fetch(channelId);

		if (!channel) {
			throw new APIError('Channel not found', 404);
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
		if (error.statusCode === 404) {
			next(error);
		} else {
			logger.error(`Error fetching channel: ${error.message}`);
			next(new APIError('Error fetching Discord channel', 500));
		}
	}
};
