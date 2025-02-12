import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
	createMessage,
	getMessages,
	getMessage,
	updateMessage,
	deleteMessage,
	getPendingMessages,
	getSentMessages,
} from '../controllers/messageController.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createMessage);
router.get('/', getMessages);
router.get('/pending', getPendingMessages);
router.get('/sent', getSentMessages);
router.get('/:id', getMessage);
router.patch('/:id', updateMessage);
router.delete('/:id', deleteMessage);

export default router;
