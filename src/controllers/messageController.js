import Message from '../models/Message.js';
import { APIError, NotFoundError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';
import discordService from '../services/discordService.js';

export const createMessage = async (req, res, next) => {
	try {
		const { content, scheduledFor, channelId } = req.body;

		if (!content) {
			throw new APIError('Message content is required', 400);
		}
		if (!scheduledFor) {
			throw new APIError('Scheduled date is required', 400);
		}

		const date = new Date(scheduledFor);
		if (isNaN(date.getTime())) {
			throw new APIError('Invalid date format', 400);
		}

		const message = await Message.create({
			content,
			scheduledFor: date,
			channelId: channelId || process.env.DISCORD_CHANNEL_ID,
		});

		logger.info(`Message created with ID: ${message._id}`);

		if (date <= new Date()) {
			try {
				const sentMessageId = await discordService.sendMessage(
					message.channelId,
					message.content
				);

				await message.markAsSent();
				logger.info(
					`Message ${message._id} sent immediately with Discord message id: ${sentMessageId}`
				);
			} catch (error) {
				logger.error(
					`Failed to send immediate message ${message._id}: ${error.message}`
				);
			}
		}

		res.status(201).json({
			status: 'success',
			data: {
				...message.toObject(),
				formattedScheduledFor:
					message.getFormattedScheduledFor('en-US'),
			},
		});
	} catch (error) {
		if (error instanceof APIError) {
			next(error);
		} else if (error.name === 'ValidationError') {
			next(new APIError(error.message, 400));
		} else {
			logger.error(`Error creating message: ${error.message}`);
			next(new APIError('Error creating message', 500));
		}
	}
};

export const getMessages = async (req, res, next) => {
	try {
		const messages = await Message.find()
			.sort({ scheduledFor: 'asc' })
			.select('-__v');

		const enrichedMessages = await Promise.all(
			messages.map(async (message) => {
				const formattedScheduledFor =
					message.getFormattedScheduledFor('en-US');
				let channelInfo = {};

				try {
					channelInfo = await discordService.getChannelInfo(
						message.channelId
					);
				} catch (error) {
					logger.error(
						`Error fetching channel info for message ${message._id}: ${error.message}`
					);
				}

				return {
					...message.toObject(),
					formattedScheduledFor,
					channelInfo,
				};
			})
		);

		res.status(200).json({
			status: 'success',
			results: enrichedMessages.length,
			data: enrichedMessages,
		});
	} catch (error) {
		logger.error(`Error fetching messages: ${error.message}`);
		next(new APIError('Error fetching messages', 500));
	}
};

export const deleteMessage = async (req, res, next) => {
	try {
		if (!req.params.id) {
			throw new APIError('Message ID is required', 400);
		}

		const message = await Message.findById(req.params.id);

		if (!message) {
			throw new NotFoundError('Message');
		}

		if (message.sent) {
			throw new APIError('Cannot delete already sent message', 400);
		}

		// Notify cancellation to Discord by sending a cancellation message.
		// This integration uses the discordService function.
		try {
			await discordService.sendMessage(
				message.channelId,
				`Scheduled message was cancelled: ${message.content}`
			);
			logger.info(
				`Cancellation notification sent for message ${req.params.id}`
			);
		} catch (error) {
			logger.warn(
				`Failed to send cancellation notification: ${error.message}`
			);
		}

		await message.remove();
		logger.info(`Message deleted with ID: ${req.params.id}`);

		res.status(204).json({
			status: 'success',
			data: null,
		});
	} catch (error) {
		if (error instanceof APIError) {
			next(error);
		} else if (error.name === 'CastError') {
			next(new APIError('Invalid message ID format', 400));
		} else {
			logger.error(`Error deleting message: ${error.message}`);
			next(new APIError('Error deleting message', 500));
		}
	}
};

export const updateMessage = async (req, res, next) => {
	try {
		const { content, scheduledFor, channelId } = req.body;
		const messageId = req.params.id;

		const message = await Message.findById(messageId);

		if (!message) {
			throw new NotFoundError('Message');
		}

		if (message.sent) {
			throw new APIError('Cannot update already sent message', 400);
		}

		if (scheduledFor) {
			const date = new Date(scheduledFor);
			if (isNaN(date.getTime())) {
				throw new APIError('Invalid date format', 400);
			}
			message.scheduledFor = date;
		}

		if (content) message.content = content;
		if (channelId) message.channelId = channelId;

		await message.save();

		if (message.scheduledFor <= new Date()) {
			try {
				const sentMessageId = await discordService.sendMessage(
					message.channelId,
					message.content
				);
				await message.markAsSent();
				logger.info(
					`Message ${message._id} sent with Discord message id: ${sentMessageId}`
				);
			} catch (error) {
				logger.error(
					`Failed to send updated message ${message._id}: ${error.message}`
				);
			}
		}

		logger.info(`Message updated with ID: ${message._id}`);
		res.status(200).json({
			status: 'success',
			data: {
				...message.toObject(),
				formattedScheduledFor:
					message.getFormattedScheduledFor('en-US'),
			},
		});
	} catch (error) {
		if (error instanceof APIError) {
			next(error);
		} else if (error.name === 'CastError') {
			next(new APIError('Invalid message ID format', 400));
		} else {
			logger.error(`Error updating message: ${error.message}`);
			next(new APIError('Error updating message', 500));
		}
	}
};

export const getMessage = async (req, res, next) => {
	try {
		const message = await Message.findById(req.params.id);

		if (!message) {
			throw new NotFoundError('Message');
		}

		res.status(200).json({
			status: 'success',
			data: message,
		});
	} catch (error) {
		if (error instanceof APIError) {
			next(error);
		} else if (error.name === 'CastError') {
			next(new APIError('Invalid message ID format', 400));
		} else {
			logger.error(`Error fetching message: ${error.message}`);
			next(new APIError('Error fetching message', 500));
		}
	}
};

export const getPendingMessages = async (req, res, next) => {
	try {
		const messages = await Message.find({
			sent: false,
			scheduledFor: { $gt: new Date() },
		})
			.sort({ scheduledFor: 'asc' })
			.select('-__v');

		res.status(200).json({
			status: 'success',
			results: messages.length,
			data: messages,
		});
	} catch (error) {
		logger.error(`Error fetching pending messages: ${error.message}`);
		next(new APIError('Error fetching pending messages', 500));
	}
};

export const getSentMessages = async (req, res, next) => {
	try {
		const messages = await Message.find({ sent: true })
			.sort({ scheduledFor: 'desc' })
			.select('-__v');

		res.status(200).json({
			status: 'success',
			results: messages.length,
			data: messages,
		});
	} catch (error) {
		logger.error(`Error fetching sent messages: ${error.message}`);
		next(new APIError('Error fetching sent messages', 500));
	}
};
