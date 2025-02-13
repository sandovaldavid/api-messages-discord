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
		const { type, active, guildId } = req.query;
		let channels = [];

		if (active !== undefined) {
			channels = await Channel.findActiveChannels();
		} else if (type === 'text') {
			channels = await Channel.findTextChannels();
		} else if (guildId) {
			channels = await Channel.findByGuild(guildId);
		} else {
			const guilds = await discordService.getGuildInfo();
			logger.info(`Found ${guilds.length} guilds successfully`);

			if (!guilds || guilds.length === 0) {
				throw new DiscordError('No Discord servers found');
			}

			for (const guild of guilds) {
				try {
					await retryOperation(async () => {
						const guildChannels =
							await discordService.getAllGuildChannels(guild.id);

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
										`Invalid channel data: ${error.message}`,
									);
									return false;
								}
							});

						const formattedChannels = validChannels.map(
							(channel) => {
								const channelDoc = new Channel(channel);
								return channelDoc.toAPI();
							},
						);

						channels.push(...formattedChannels);

						await new Promise((resolve) =>
							setTimeout(resolve, RATE_LIMIT_DELAY),
						);
					});
				} catch (guildError) {
					logger.error(
						`Error fetching channels for guild: ${guildError.message}`,
					);
					continue;
				}
			}
		}

		if (channels.length === 0) {
			throw new NotFoundError('Text channels');
		}

		channels.sort((a, b) => {
			const guildCompare = a.guildName.localeCompare(b.guildName);
			return guildCompare !== 0
				? guildCompare
				: a.name.localeCompare(b.name);
		});

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

		let channel = await Channel.findOne({ channelId });

		const channelFromDiscord = await retryOperation(async () => {
			return await discordService.getChannelInfo(channelId);
		});

		if (!channelFromDiscord) {
			throw new NotFoundError('Channel');
		}

		const channelData = {
			channelId: channelFromDiscord.id,
			name: channelFromDiscord.name,
			guildId: channelFromDiscord.guildId,
			guildName: channelFromDiscord.guildName,
			type: channelFromDiscord.type,
			isActive: channel ? channel.isActive : true,
		};

		if (channel) {
			Object.assign(channel, channelData);
			await channel.save();
		} else {
			channel = new Channel(channelData);
			await channel.save();
		}

		const channelInfo = {
			...channel.toAPI(),
			types: {
				isText: channel.isTextChannel(),
				isVoice: channel.isVoiceChannel(),
				isCategory: channel.isCategoryChannel(),
				isNews: channel.isNewsChannel(),
				typeLabel: channel.getChannelType(),
			},
			displayName: channel.displayName,
			status: {
				isActive: channel.isActive,
				isInactive: channel.isInactive,
			},
			timestamps: {
				createdAt: channel.createdAt,
				updatedAt: channel.updatedAt,
			},
		};

		logger.info(`Channel ${channelId} details retrieved successfully`);

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
			logger.error(`Error fetching channel: ${error.message}`);
			next(new DiscordError('Error fetching channel details'));
		}
	}
};

export const getChannelsByGuild = async (req, res, next) => {
	try {
		const { guildId } = req.params;

		if (!guildId) {
			throw new APIError('Guild ID is required', 400);
		}

		const [guildChannels, guildInfo] = await Promise.all([
			retryOperation(async () => {
				return await discordService.getAllGuildChannels(guildId);
			}),
			retryOperation(async () => {
				return await discordService.getGuildInfo(guildId);
			}),
		]);

		const validChannels = guildChannels
			.map((channel) => ({
				channelId: channel.id,
				name: channel.name,
				guildId: guildInfo.id,
				guildName: guildInfo.name,
				type: channel.type,
				isActive: true,
			}))
			.filter((channel) => {
				try {
					return validateChannel(channel);
				} catch (error) {
					logger.warn(`Invalid channel data: ${error.message}`);
					return false;
				}
			});

		const formattedChannels = validChannels.map((channelData) => {
			const channel = new Channel(channelData);
			return {
				...channel.toAPI(),
				types: {
					isText: channel.isTextChannel(),
					isVoice: channel.isVoiceChannel(),
					isCategory: channel.isCategoryChannel(),
					isNews: channel.isNewsChannel(),
					typeLabel: channel.getChannelType(),
				},
				displayName: channel.displayName,
			};
		});

		formattedChannels.sort((a, b) => a.name.localeCompare(b.name));

		logger.info(
			`Retrieved ${formattedChannels.length} channels for guild ${guildInfo.name}`,
		);

		res.status(200).json({
			status: 'success',
			results: formattedChannels.length,
			data: {
				guild: {
					id: guildInfo.id,
					name: guildInfo.name,
					memberCount: guildInfo.memberCount,
				},
				channels: formattedChannels,
			},
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
				setTimeout(resolve, RETRY_DELAY * (i + 1)),
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
		logger.info(`Found ${guilds.length} Discord servers to sync`);

		if (!guilds || guilds.length === 0) {
			throw new DiscordError('No Discord servers found');
		}

		const channels = [];

		for (const guild of guilds) {
			try {
				await retryOperation(async () => {
					const guildChannels =
						await discordService.getAllGuildChannels(guild.id);

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
									`Invalid channel data: ${error.message}`,
								);
								return false;
							}
						});

					channels.push(...validChannels);

					await new Promise((resolve) =>
						setTimeout(resolve, RATE_LIMIT_DELAY),
					);
				});
			} catch (guildError) {
				logger.error(
					`Error fetching channels for guild ${guild.name}: ${guildError.message}`,
				);
			}
		}

		if (channels.length === 0) {
			throw new NotFoundError('Text channels');
		}

		totalChannels = channels.length;
		logger.info(
			`Processing ${totalChannels} channels in chunks of ${chunkSize}`,
		);

		const chunkedOperations = [];
		for (let i = 0; i < channels.length; i += chunkSize) {
			const chunk = channels.slice(i, i + chunkSize).map((channel) => ({
				updateOne: {
					filter: { channelId: channel.channelId },
					update: {
						$set: {
							...channel,
							updatedAt: new Date(),
						},
					},
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
						(((index + 1) * chunkSize) / totalChannels) * 100,
					);
					logger.info(
						`Sync progress: ${progress}% (${
							(index + 1) * chunkSize
						}/${totalChannels})`,
					);
				});

				await new Promise((resolve) =>
					setTimeout(resolve, RATE_LIMIT_DELAY),
				);
			} catch (chunkError) {
				logger.error(
					`Error processing chunk ${index + 1}: ${chunkError.message}`,
				);
				throw new APIError(`Failed to process chunk ${index + 1}`);
			}
		}

		const activeChannels = await Channel.findActiveChannels();
		const textChannels = await Channel.findTextChannels();

		logger.info(`Successfully synchronized ${totalChannels} channels`);
		logger.info(`Active channels: ${activeChannels.length}`);
		logger.info(`Text channels: ${textChannels.length}`);

		res.status(200).json({
			status: 'success',
			message: `${totalChannels} channels synchronized`,
			results: totalChannels,
			details: {
				matched: totalMatched,
				modified: totalModified,
				upserted: totalUpserted,
				activeChannels: activeChannels.length,
				textChannels: textChannels.length,
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
		const { isActive, action = 'hide' } = req.body;

		if (isActive === undefined) {
			throw new APIError('isActive status is required', 400);
		}

		const channelFromDiscord = await retryOperation(async () => {
			return await discordService.getChannelInfo(channelId);
		});

		if (!channelFromDiscord) {
			throw new NotFoundError('Channel');
		}

		let discordUpdateResult;
		if (!isActive) {
			if (action === 'archive') {
				discordUpdateResult =
					await discordService.archiveChannel(channelId);
			} else {
				discordUpdateResult = await discordService.hideChannel(
					channelId,
					true,
				);
			}
		} else {
			discordUpdateResult = await discordService.hideChannel(
				channelId,
				false,
			);
		}

		const updatedChannel = await Channel.updateChannelStatus(
			channelId,
			isActive,
		);

		if (!updatedChannel) {
			const channelData = {
				channelId: channelFromDiscord.id,
				name: channelFromDiscord.name,
				guildId: channelFromDiscord.guildId,
				guildName: channelFromDiscord.guildName,
				type: channelFromDiscord.type,
				isActive: isActive,
			};

			const newChannel = new Channel(channelData);
			await newChannel.save();

			logger.info(
				`Created new channel ${channelId} with status ${isActive}`,
			);

			const channelInfo = {
				...newChannel.toAPI(),
				types: {
					isText: newChannel.isTextChannel(),
					isVoice: newChannel.isVoiceChannel(),
					isCategory: newChannel.isCategoryChannel(),
					isNews: newChannel.isNewsChannel(),
					typeLabel: newChannel.getChannelType(),
				},
				displayName: newChannel.displayName,
				status: {
					isActive: newChannel.isActive,
					isInactive: newChannel.isInactive,
				},
			};

			return res.status(201).json({
				status: 'success',
				message: 'Channel created and status set',
				data: channelInfo,
			});
		}

		const channelInfo = {
			...updatedChannel.toAPI(),
			types: {
				isText: updatedChannel.isTextChannel(),
				isVoice: updatedChannel.isVoiceChannel(),
				isCategory: updatedChannel.isCategoryChannel(),
				isNews: updatedChannel.isNewsChannel(),
				typeLabel: updatedChannel.getChannelType(),
			},
			displayName: updatedChannel.displayName,
			status: {
				isActive: updatedChannel.isActive,
				isInactive: updatedChannel.isInactive,
			},
			timestamps: {
				createdAt: updatedChannel.createdAt,
				updatedAt: updatedChannel.updatedAt,
			},
		};

		logger.info(`Channel ${channelId} status updated to ${isActive}`);

		res.status(200).json({
			status: 'success',
			message: `Channel ${
				isActive ? 'activated' : 'deactivated'
			} and ${action}d`,
			data: {
				...channelInfo,
				discord: discordUpdateResult,
			},
		});
	} catch (error) {
		if (error instanceof APIError) {
			next(error);
		} else if (error.code === 50013) {
			next(
				new DiscordError(
					'Bot lacks required permissions: MANAGE_CHANNELS, MANAGE_ROLES',
				),
			);
		} else if (error.code === 10003) {
			next(new NotFoundError('Discord channel not found'));
		} else if (error.message.includes('Missing Permissions')) {
			next(
				new DiscordError(
					'Bot needs additional permissions to modify this channel',
				),
			);
		} else {
			logger.error(`Error updating channel status: ${error.message}`);
			next(new APIError('Error updating channel status', 500));
		}
	}
};

export const getTextChannels = async (req, res, next) => {
	try {
		const textChannels = await Channel.findTextChannels();
		res.status(200).json({
			status: 'success',
			data: textChannels.map((channel) => channel.toAPI()),
		});
	} catch (error) {
		next(error);
	}
};
