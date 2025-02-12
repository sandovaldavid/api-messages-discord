import express from 'express';
import {
	createMessage,
	getMessages,
	deleteMessage,
} from '../controllers/messageController.js';

const router = express.Router();

router.post('/', createMessage);
router.get('/', getMessages);
router.delete('/:id', deleteMessage);

export default router;
