import {
	APIError,
	DiscordError,
	NotFoundError,
} from '../middleware/errorHandler.js';
import discordService from '../services/discordService.js';
import logger from '../utils/logger.js';

export const getChannels = async (req, res, next) => {
	try {
		const channels = [];
		const guilds = await discordService.getGuildInfo();
		logger.info(`Found ${guilds.length} guilds successfully`);

		if (!guilds || guilds.length === 0) {
			throw new DiscordError('No Discord servers found');
		}

		for (const guild of guilds) {
			try {
				const guildChannels = await discordService.getAllGuildChannels(
					guild.id
				);
				channels.push(
					...guildChannels.map((channel) => ({
						...channel,
						guildName: guild.name,
						guildId: guild.id,
					}))
				);
			} catch (guildError) {
				logger.error(
					`Error fetching channels for guild: ${guildError.message}`
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

		const channelInfo = await discordService.getChannelInfo(channelId);

		res.status(200).json({
			status: 'success',
			data: channelInfo,
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
