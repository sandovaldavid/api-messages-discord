import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
		trim: true,
		maxlength: 2000,
	},
	scheduledFor: {
		type: Date,
		required: true,
		index: true,
	},
	channelId: {
		type: String,
		required: true,
		ref: 'Channel',
	},
	sent: {
		type: Boolean,
		default: false,
		index: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		immutable: true,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

messageSchema.methods.markAsSent = async function () {
	this.sent = true;
	this.updatedAt = new Date();
	await this.save();
	return this;
};

messageSchema.methods.reschedule = async function (newTime) {
	this.scheduledFor = newTime;
	this.updatedAt = new Date();
	await this.save();
	return this;
};

messageSchema.methods.getFormattedScheduledFor = function () {
	return this.scheduledFor.toISOString();
};

messageSchema.statics.findPending = function () {
	return this.find({
		scheduledFor: { $lte: new Date() },
		sent: false,
	});
};

export default mongoose.model('Message', messageSchema);
