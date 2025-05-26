import express from "express";
import { ChatAI } from "../controllers/ChatAi";

const ChatbotRouter = express.Router();

ChatbotRouter.get("/", ChatAI);

export default ChatbotRouter;
