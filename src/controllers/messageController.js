import Message from '../models/Message.js';
import discordClient from '../config/discord.js';
import { APIError } from '../middleware/errorHandler.js';

export const createMessage = async (req, res, next) => {
	try {
		const { content, scheduledFor, channelId } = req.body;

		const message = await Message.create({
			content,
			scheduledFor: new Date(scheduledFor),
			channelId: channelId || process.env.DISCORD_CHANNEL_ID,
		});

		res.status(201).json({
			status: 'success',
			data: message,
		});
	} catch (error) {
		next(new APIError(error.message, 400));
	}
};

export const getMessages = async (req, res, next) => {
	try {
		const messages = await Message.find().sort({ scheduledFor: 'asc' });
		res.json({
			status: 'success',
			data: messages,
		});
	} catch (error) {
		next(new APIError(error.message, 500));
	}
};

export const deleteMessage = async (req, res, next) => {
	try {
		const message = await Message.findByIdAndDelete(req.params.id);
		if (!message) {
			throw new APIError('Message not found', 404);
		}
		res.status(204).json({
			status: 'success',
			data: null,
		});
	} catch (error) {
		next(new APIError(error.message, error.statusCode || 500));
	}
};
