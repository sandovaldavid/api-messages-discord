import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI);

		logger.info(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		logger.error(`Error: ${error.message}`);
		process.exit(1);
	}
};

// Eventos de conexión
mongoose.connection.on('disconnected', () => {
	logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
	logger.error(`MongoDB error: ${err}`);
});

export default connectDB;
