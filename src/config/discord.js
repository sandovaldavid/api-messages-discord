import { Client, GatewayIntentBits } from 'discord.js';
import logger from '@utils/logger.js';
import { DiscordError } from '@middleware/errorHandler.js';

class DiscordClient {
	constructor() {
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMembers,
			],
		});

		this.setupEventHandlers();
	}

	setupEventHandlers() {
		this.client.on('ready', () => {
			logger.info(`Discord bot logged in as ${this.client.user.tag}`);
		});

		this.client.on('error', (error) => {
			logger.error(`Discord client error: ${error.message}`);
		});

		this.client.on('disconnect', () => {
			logger.warn('Discord bot disconnected');
			this.attemptReconnect();
		});
	}

	async connect() {
		try {
			await this.client.login(process.env.DISCORD_TOKEN);
		} catch (error) {
			logger.error(`Failed to connect to Discord: ${error.message}`);
			throw new DiscordError('Discord connection failed');
		}
	}

	async attemptReconnect(maxAttempts = 5) {
		let attempts = 0;
		const reconnect = async () => {
			try {
				await this.connect();
				logger.info('Successfully reconnected to Discord');
			} catch (error) {
				attempts++;
				if (attempts < maxAttempts) {
					logger.warn(`Reconnection attempt ${attempts} failed, retrying... Error: ${error.message}`);
					setTimeout(reconnect, 5000 * attempts);
				} else {
					logger.error(`Max reconnection attempts reached. Last error: ${error.message}`);
					throw new DiscordError(`Failed to reconnect to Discord: ${error.message}`);
				}
			}
		};
		await reconnect();
	}

	async isConnected() {
		return this.client?.isReady() || false;
	}

	async getStatus() {
		return {
			connected: await this.isConnected(),
			ping: this.client?.ws.ping || -1,
			uptime: this.client?.uptime || 0,
		};
	}
}

// Singleton instance
const discordClient = new DiscordClient();
export default discordClient;
