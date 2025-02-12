import {
	APIError,
	DiscordError,
	NotFoundError,
} from '../middleware/errorHandler.js';
import discordService from '../services/discordService.js';
import Channel from '../models/channel.js';
import logger from '../utils/logger.js';

// Settings for retrying operations
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second between retries
const RATE_LIMIT_DELAY = 500; // 500ms between requests

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

export const getChannelsByGuild = async (req, res, next) => {
	try {
		const { guildId } = req.params;

		if (!guildId) {
			throw new APIError('Guild ID is required', 400);
		}

		const guildChannels = await discordService.getAllGuildChannels(guildId);
		const guildInfo = await discordService.getGuildInfo(guildId);

		const channels = guildChannels.map((channel) => ({
			...channel,
			guildName: guildInfo.name,
			guildId: guildInfo.id,
		}));

		res.status(200).json({
			status: 'success',
			results: channels.length,
			data: channels,
		});
	} catch (error) {
		if (error instanceof APIError) {
			next(error);
		} else {
			logger.error(`Error fetching guild channels: ${error.message}`);
			next(new DiscordError('Error fetching guild channels'));
		}
	}
};

const validateChannel = (channel) => {
	if (!channel.channelId || typeof channel.channelId !== 'string') {
		throw new APIError('Invalid channel ID');
	}
	if (!channel.name || typeof channel.name !== 'string') {
		throw new APIError('Invalid channel name');
	}
	if (!channel.guildId || typeof channel.guildId !== 'string') {
		throw new APIError('Invalid guild ID');
	}
	if (typeof channel.type !== 'number') {
		throw new APIError('Invalid channel type');
	}
	return true;
};

const retryOperation = async (operation, attempts = RETRY_ATTEMPTS) => {
	for (let i = 0; i < attempts; i++) {
		try {
			return await operation();
		} catch (error) {
			if (i === attempts - 1) throw error;
			await new Promise((resolve) =>
				setTimeout(resolve, RETRY_DELAY * (i + 1))
			);
			logger.warn(`Retry attempt ${i + 1} of ${attempts}`);
		}
	}
};

export const syncChannels = async (req, res, next) => {
	try {
		const chunkSize = parseInt(process.env.CHUNK_SIZE) || 100;
		let progress = 0;
		let totalChannels = 0;

		const guilds = await discordService.getGuildInfo();

		if (!guilds || guilds.length === 0) {
			throw new DiscordError('No Discord servers found');
		}

		const channels = [];

		for (const guild of guilds) {
			try {
				await retryOperation(async () => {
					const guildChannels =
						await discordService.getAllGuildChannels(guild.id);

					// Validar cada canal antes de agregarlo
					const validChannels = guildChannels
						.map((channel) => ({
							channelId: channel.id,
							name: channel.name,
							guildId: guild.id,
							guildName: guild.name,
							type: channel.type,
						}))
						.filter((channel) => {
							try {
								return validateChannel(channel);
							} catch (error) {
								logger.warn(
									`Invalid channel data: ${error.message}`
								);
								return false;
							}
						});

					channels.push(...validChannels);

					await new Promise((resolve) =>
						setTimeout(resolve, RATE_LIMIT_DELAY)
					);
				});
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

		totalChannels = channels.length;
		const chunkedOperations = [];

		for (let i = 0; i < channels.length; i += chunkSize) {
			const chunk = channels.slice(i, i + chunkSize).map((channel) => ({
				updateOne: {
					filter: { channelId: channel.channelId },
					update: { $set: channel },
					upsert: true,
				},
			}));
			chunkedOperations.push(chunk);
		}

		let totalModified = 0;
		let totalMatched = 0;
		let totalUpserted = 0;

		for (const [index, operationsChunk] of chunkedOperations.entries()) {
			try {
				await retryOperation(async () => {
					const result = await Channel.bulkWrite(operationsChunk, {
						ordered: false,
						wtimeout: 30000,
					});

					totalMatched += result.matchedCount;
					totalModified += result.modifiedCount;
					totalUpserted += result.upsertedCount;

					progress = Math.round(
						(((index + 1) * chunkSize) / totalChannels) * 100
					);
					logger.info(
						`Sync progress: ${progress}% (${
							(index + 1) * chunkSize
						}/${totalChannels})`
					);
				});
			} catch (chunkError) {
				logger.error(
					`Error processing chunk ${index + 1}: ${chunkError.message}`
				);
				throw new APIError(`Failed to process chunk ${index + 1}`);
			}

			await new Promise((resolve) =>
				setTimeout(resolve, RATE_LIMIT_DELAY)
			);
		}

		logger.info(`Successfully synchronized ${totalChannels} channels`);

		res.status(200).json({
			status: 'success',
			message: `${totalChannels} channels synchronized`,
			results: totalChannels,
			details: {
				matched: totalMatched,
				modified: totalModified,
				upserted: totalUpserted,
				progress: '100%',
			},
		});
	} catch (error) {
		if (error instanceof APIError) {
			next(error);
		} else {
			logger.error(`Error synchronizing channels: ${error.message}`);
			next(new DiscordError('Error synchronizing channels'));
		}
	}
};

export const updateChannelStatus = async (req, res, next) => {
	try {
		const { channelId } = req.params;
		const { isActive } = req.body;

		if (isActive === undefined) {
			throw new APIError('isActive status is required', 400);
		}

		const channel = await Channel.findOne({ channelId });

		if (!channel) {
			throw new NotFoundError('Channel');
		}

		channel.isActive = isActive;
		await channel.save();

		logger.info(`Channel ${channelId} status updated to ${isActive}`);

		res.status(200).json({
			status: 'success',
			data: channel,
		});
	} catch (error) {
		if (error instanceof APIError) {
			next(error);
		} else {
			logger.error(`Error updating channel status: ${error.message}`);
			next(new APIError('Error updating channel status', 500));
		}
	}
};
