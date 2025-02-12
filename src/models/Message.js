import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
	},
	scheduledFor: {
		type: Date,
		required: true,
	},
	channelId: {
		type: String,
		required: true,
	},
	sent: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('Message', messageSchema);
