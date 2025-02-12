import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
	channelId: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	guildId: {
		type: String,
		required: true,
	},
	guildName: {
		type: String,
		required: true,
	},
	type: {
		type: Number,
		required: true,
		default: 0, // 0 represents text channel in Discord API
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Update the updatedAt timestamp before saving
channelSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

export default mongoose.model('Channel', channelSchema);
