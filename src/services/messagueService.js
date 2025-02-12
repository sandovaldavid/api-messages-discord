import Message from '../models/Message.js';
import discordService from './discordService.js';
import discordClient from '../config/discord.js';
import logger from '../utils/logger.js';

const checkScheduledMessages = async () => {
	try {
		const now = new Date();
		const messages = await Message.find({
			scheduledFor: { $lte: now },
			sent: false,
		});

		for (const message of messages) {
			try {
				await discordService.sendMessage(
					message.channelId,
					message.content
				);
				message.sent = true;
				await message.save();
				logger.info(`Sent scheduled message: ${message._id}`);
			} catch (error) {
				logger.error(
					`Failed to send message ${message._id}: ${error.message}`
				);
			}
		}
	} catch (error) {
		logger.error(`Error checking scheduled messages: ${error.message}`);
	}
};

const testBotConnection = async () => {
	try {
		await discordClient.connect();
		logger.info('Bot connected successfully');
	} catch (error) {
		logger.error(`Bot connection failed: ${error.message}`);
	}
};

// Verificar mensajes cada minuto
setInterval(checkScheduledMessages, 60000);

export { checkScheduledMessages, testBotConnection };
