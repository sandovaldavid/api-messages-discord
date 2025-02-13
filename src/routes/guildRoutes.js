import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
	getGuilds,
	getGuildById,
	syncGuilds,
	updateGuildStatus,
	getGuildChannels,
	getGuildStatus,
} from '../controllers/guildController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getGuilds);
router.get('/sync', syncGuilds);
router.get('/:guildId', getGuildById);
router.get('/:guildId/channels', getGuildChannels);
router.patch('/:guildId/status', updateGuildStatus);
router.get('/:guildId/status', getGuildStatus);

export default router;
