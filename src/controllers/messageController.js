import Message from '../models/Message.js';
import { APIError, NotFoundError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

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

		res.status(201).json({
			status: 'success',
			data: message,
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

		res.status(200).json({
			status: 'success',
			results: messages.length,
			data: messages,
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

		await Message.findByIdAndDelete(req.params.id);
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
