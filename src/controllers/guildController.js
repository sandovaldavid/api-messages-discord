import { APIError, DiscordError, NotFoundError } from '../middleware/errorHandler.js';
import discordService from '../services/discordService.js';
import Guild from '../models/Guild.js';
import Channel from '../models/channel.js';
import logger from '../utils/logger.js';

export const getGuilds = async (req, res, next) => {
	try {
		const localGuilds = await Guild.findActiveGuilds();
		await Guild.populate(localGuilds, { path: 'channels' });

		const enrichedGuilds = await Promise.all(
			localGuilds.map(async (guild) => {
				let discordData = {};
				let guildChannels = guild.channels;

				try {
					discordData = await discordService.getGuildInfo(guild.guildId);

					if (!guildChannels || guildChannels.length === 0) {
						const discordChannels = await discordService.getAllGuildChannels(guild.guildId);
						guildChannels = discordChannels;
					}
				} catch (error) {
					logger.error(`Error fetching Discord info for guild ${guild.guildId}: ${error.message}`);
				}
				return {
					...guild.toObject(),
					channels: guildChannels,
					summary: guild.getSummary(),
					shortDescription: guild.shortDescription,
					discordData,
				};
			})
		);

		logger.info(`Fetched and enriched ${enrichedGuilds.length} active guilds`);

		res.status(200).json({
			status: 'success',
			results: enrichedGuilds.length,
			data: enrichedGuilds,
		});
	} catch (error) {
		logger.error(`Error fetching guilds: ${error.message}`);
		next(new DiscordError('Error fetching Discord guilds'));
	}
};

export const getGuildById = async (req, res, next) => {
	try {
		const { guildId } = req.params;

		if (!guildId) {
			throw new APIError('Guild ID is required', 400);
		}

		const guildInfo = await discordService.getGuildInfo(guildId);

		if (!guildInfo) {
			throw new NotFoundError('Guild');
		}

		res.status(200).json({
			status: 'success',
			data: guildInfo,
		});
	} catch (error) {
		if (error instanceof APIError) {
			next(error);
		} else {
			logger.error(`Error fetching guild: ${error.message}`);
			next(new DiscordError('Error fetching Discord guild'));
		}
	}
};

export const syncGuilds = async (req, res, next) => {
	try {
		const discordGuilds = await discordService.getGuildInfo();

		const results = {
			created: 0,
			updated: 0,
			failed: 0,
		};

		for (const guildData of discordGuilds) {
			try {
				if (!guildData.id || !guildData.name || !guildData.ownerId) {
					logger.error('Missing required guild data:', {
						id: guildData.id,
						name: guildData.name,
						ownerId: guildData.ownerId,
					});
					throw new Error('Missing required guild data');
				}

				const guild = await Guild.createOrUpdateGuild({
					id: guildData.id,
					name: guildData.name,
					memberCount: guildData.memberCount,
					ownerId: guildData.ownerId,
				});

				if (guild.isNew) {
					results.created++;
				} else {
					results.updated++;
				}

				logger.info(`Synchronized guild: ${guild.name}`);

				const discordChannels = await discordService.getAllGuildChannels(guildData.id);

				for (const channelData of discordChannels) {
					const updatedChannel = await Channel.findOneAndUpdate(
						{ channelId: channelData.id },
						{
							channelId: channelData.id,
							name: channelData.name,
							guildId: guildData.id,
							guildName: guildData.name,
							type: channelData.type,
							isActive: true,
						},
						{ upsert: true, new: true }
					);

					await guild.addChannel(updatedChannel._id);
				}
			} catch (error) {
				results.failed++;
				logger.error(`Error syncing guild ${guildData?.name || 'unknown'}: ${error.message}`);
				continue;
			}
		}

		res.status(200).json({
			status: 'success',
			message: 'Guilds synchronized successfully',
			data: results,
		});
	} catch (error) {
		logger.error(`Error synchronizing guilds: ${error.message}`);
		next(new DiscordError('Error synchronizing Discord guilds'));
	}
};

export const updateGuildStatus = async (req, res, next) => {
	try {
		const { guildId } = req.params;
		const { isActive } = req.body;

		if (isActive === undefined) {
			throw new APIError('isActive status is required', 400);
		}

		const guild = await Guild.findOne({ guildId });

		if (!guild) {
			throw new NotFoundError('Guild');
		}

		guild.isActive = isActive;
		await guild.save();

		logger.info(`Guild ${guildId} status updated to ${isActive}`);

		res.status(200).json({
			status: 'success',
			data: guild,
		});
	} catch (error) {
		if (error instanceof APIError) {
			next(error);
		} else {
			logger.error(`Error updating guild status: ${error.message}`);
			next(new APIError('Error updating guild status', 500));
		}
	}
};

export const getGuildChannels = async (req, res, next) => {
	try {
		const { guildId } = req.params;

		if (!guildId) {
			throw new APIError('Guild ID is required', 400);
		}

		const guild = await Guild.findOne({ guildId }).populate('channels');

		if (!guild) {
			throw new NotFoundError('Guild');
		}

		res.status(200).json({
			status: 'success',
			results: guild.channels.length,
			data: guild.channels,
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

export const getGuildStatus = async (req, res, next) => {
	try {
		const { guildId } = req.params;

		if (!guildId) {
			throw new APIError('Guild ID is required', 400);
		}

		const guild = await Guild.findOne({ guildId });

		if (!guild) {
			throw new NotFoundError('Guild');
		}

		// Get Discord guild status
		const discordGuild = await discordService.getGuildInfo(guildId);

		res.status(200).json({
			status: 'success',
			data: {
				guildId: guild.guildId,
				name: guild.name,
				isActive: guild.isActive,
				memberCount: discordGuild.memberCount,
				lastUpdated: guild.updatedAt,
				discordStatus: {
					available: !!discordGuild,
					memberCount: discordGuild.memberCount,
					owner: discordGuild.owner,
				},
			},
		});
	} catch (error) {
		if (error instanceof APIError) {
			next(error);
		} else {
			logger.error(`Error fetching guild status: ${error.message}`);
			next(new DiscordError('Error fetching guild status'));
		}
	}
};
