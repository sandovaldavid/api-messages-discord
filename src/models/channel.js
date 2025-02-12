import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
	channelId: {
		type: String,
		required: true,
		unique: true,
		index: true,
	},
	name: {
		type: String,
		required: true,
		trim: true,
	},
	guildId: {
		type: String,
		required: true,
		index: true,
	},
	guildName: {
		type: String,
		required: true,
		trim: true,
	},
	type: {
		type: Number,
		required: true,
		default: 0,
		enum: [0, 1, 2, 3, 4, 5],
	},
	isActive: {
		type: Boolean,
		default: true,
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

channelSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

channelSchema.methods = {
	isTextChannel() {
		return this.type === 0;
	},

	isVoiceChannel() {
		return this.type === 2;
	},

	isCategoryChannel() {
		return this.type === 4;
	},

	isNewsChannel() {
		return this.type === 5;
	},

	getChannelType() {
		const types = {
			0: 'text',
			1: 'dm',
			2: 'voice',
			3: 'group',
			4: 'category',
			5: 'news',
		};
		return types[this.type] || 'unknown';
	},

	toAPI() {
		return {
			id: this.channelId,
			name: this.name,
			type: this.getChannelType(),
			guildId: this.guildId,
			guildName: this.guildName,
			isActive: this.isActive,
		};
	},
};

channelSchema.statics = {
	async findByGuild(guildId) {
		return this.find({ guildId, isActive: true }).sort('name');
	},

	async findActiveChannels() {
		return this.find({ isActive: true }).sort('guildName name');
	},

	async findTextChannels() {
		return this.find({ type: 0, isActive: true }).sort('guildName name');
	},

	async updateChannelStatus(channelId, isActive) {
		return this.findOneAndUpdate(
			{ channelId },
			{ isActive },
			{ new: true }
		);
	},
};

channelSchema.virtual('isInactive').get(function () {
	return !this.isActive;
});

channelSchema.virtual('displayName').get(function () {
	return `${this.guildName} > ${this.name}`;
});

channelSchema.index({ guildId: 1, name: 1 }, { unique: true });
channelSchema.index({ guildId: 1, type: 1 });

export default mongoose.model('Channel', channelSchema);
