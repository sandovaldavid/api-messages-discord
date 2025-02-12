import express from 'express';
import {
	getChannels,
	getChannelById,
} from '../controllers/channelController.js';

const router = express.Router();

router.get('/', getChannels);
router.get('/:channelId', getChannelById);

export default router;
