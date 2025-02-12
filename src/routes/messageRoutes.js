import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
	createMessage,
	getMessages,
	deleteMessage,
} from '../controllers/messageController.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createMessage);
router.get('/', getMessages);
router.delete('/:id', deleteMessage);

export default router;
