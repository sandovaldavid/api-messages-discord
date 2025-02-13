import mongoose from 'mongoose';

const guildSchema = new mongoose.Schema(
	{
		guildId: {
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
		memberCount: {
			type: Number,
			required: true,
			default: 0,
			min: 0,
		},
		ownerId: {
			type: String,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
			index: true,
		},
		icon: {
			type: String,
			default: null,
			trim: true,
		},
		description: {
			type: String,
			default: null,
			trim: true,
			maxlength: 1000,
		},
		region: {
			type: String,
			default: null,
			trim: true,
		},
		channels: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Channel',
				index: true,
			},
		],
		createdAt: {
			type: Date,
			default: Date.now,
			immutable: true,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		collection: 'guilds',
		timestamps: true,
		strict: true,
	}
);

// Update the updatedAt timestamp before saving
guildSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

guildSchema.methods = {
	async addChannel(channelId) {
		if (!this.channels.some((ch) => ch.toString() === channelId.toString())) {
			this.channels.push(channelId);
			await this.save();
		}
		return this;
	},

	async removeChannel(channelId) {
		this.channels = this.channels.filter((ch) => ch.toString() !== channelId.toString());
		await this.save();
		return this;
	},

	async toggleActive() {
		this.isActive = !this.isActive;
		await this.save();
		return this;
	},

	getSummary() {
		return `${this.name} - ${new Intl.NumberFormat('en-US').format(this.memberCount)} members`;
	},
};

guildSchema.statics = {
	async findActiveGuilds() {
		return this.find({ isActive: true });
	},

	async findByOwnerId(ownerId) {
		return this.find({ ownerId });
	},

	async createOrUpdateGuild(guildData) {
		return this.findOneAndUpdate(
			{ guildId: guildData.id },
			{
				guildId: guildData.id,
				name: guildData.name,
				memberCount: guildData.memberCount || 0,
				ownerId: guildData.ownerId,
				isActive: true,
				updatedAt: new Date(),
			},
			{
				upsert: true,
				new: true,
				runValidators: true,
			}
		);
	},
};

guildSchema.virtual('shortDescription').get(function () {
	if (this.description && this.description.length > 100) {
		return this.description.substring(0, 100) + '...';
	}
	return this.description;
});

export default mongoose.model('Guild', guildSchema, 'guilds');
