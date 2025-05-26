import express from "express";
import {
  getAllConversations,
  getConversation,
  sendMessageFromAdmin,
  sendMessageFromUser,
} from "../controllers/conversation";

const router = express.Router();

router.get("/", getAllConversations);

router.get("/:userId", getConversation);

// Admin gửi tin nhắn
router.post("/:conversationId/messageAdmin", sendMessageFromAdmin);

// User gửi tin nhắn
router.post("/:userId/message", sendMessageFromUser);

export default router;
