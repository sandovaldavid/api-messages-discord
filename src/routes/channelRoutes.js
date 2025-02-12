import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
	getChannels,
	getChannelById,
	getChannelsByGuild,
	syncChannels,
	updateChannelStatus,
} from '../controllers/channelController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getChannels);
router.get('/sync', syncChannels);
router.get('/guild/:guildId', getChannelsByGuild);
router.get('/:channelId', getChannelById);
router.patch('/:channelId/status', updateChannelStatus);

export default router;
