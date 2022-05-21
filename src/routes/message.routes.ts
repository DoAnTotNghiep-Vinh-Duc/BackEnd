import express from 'express';
import { AuthMiddleware } from '../middleware/auth-middleware';
import { MessageController } from '../controllers/message.controller';
export const messageRoutes = express.Router();

messageRoutes.get("/",AuthMiddleware.verifyAccessToken, AuthMiddleware.checkAccountIsActive, MessageController.getMessageOfUser);
messageRoutes.post("/",AuthMiddleware.verifyAccessToken, AuthMiddleware.checkAccountIsActive, MessageController.addMessage);