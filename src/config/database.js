import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
	try {
		const dbName = 'api-messages-discord';
		const uri = process.env.MONGODB_URI;

		if (!uri) {
			throw new Error(
				'MONGODB_URI is not defined in environment variables'
			);
		}

		const conn = await mongoose.connect(uri, {
			dbName: dbName,
		});

		logger.info(`MongoDB Connected: ${conn.connection.host}`);
		logger.info(`Database: ${conn.connection.name}`);

		mongoose.connection.on('disconnected', () => {
			logger.warn('MongoDB disconnected, attempting to reconnect...');
		});

		mongoose.connection.on('error', (err) => {
			logger.error(`MongoDB error: ${err}`);
		});

		mongoose.connection.on('reconnected', () => {
			logger.info('MongoDB reconnected');
		});
	} catch (error) {
		logger.error(`MongoDB connection error: ${error.message}`);
		process.exit(1);
	}
};

export default connectDB;
