import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
	getChannels,
	getChannelById,
} from '../controllers/channelController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getChannels);
router.get('/:channelId', getChannelById);

export default router;
