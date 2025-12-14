import express from 'express';
import { getUserConversation, sendMessage } from '../controller/message.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { getConversation } from '../controller/message.js';
const router = express.Router();


router.post("/send",verifyToken,sendMessage);
router.get("/conversations",verifyToken,getConversation);
router.get("/chat/:listingId/:otherUserId",verifyToken,getUserConversation)

export default router;