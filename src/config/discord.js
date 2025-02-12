import { Client, GatewayIntentBits } from 'discord.js';
import logger from '../utils/logger.js';

class DiscordClient {
	constructor() {
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
			],
		});

		this.client.on('ready', () => {
			logger.info(`Discord bot logged in as ${this.client.user.tag}`);
		});

		this.client.on('error', (error) => {
			logger.error(`Discord client error: ${error.message}`);
		});
	}

	async connect() {
		try {
			await this.client.login(process.env.DISCORD_TOKEN);
		} catch (error) {
			logger.error(`Failed to connect to Discord: ${error.message}`);
			process.exit(1);
		}
	}

	async sendMessage(channelId, content) {
		try {
			const channel = await this.client.channels.fetch(channelId);
			if (!channel) {
				throw new Error(`Channel ${channelId} not found`);
			}

			const message = await channel.send(content);
			return message.id;
		} catch (error) {
			logger.error(`Error sending message: ${error.message}`);
			throw error;
		}
	}
}

const discordClient = new DiscordClient();
export default discordClient;
