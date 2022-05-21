import express from 'express';
import { AuthMiddleware } from '../../middleware/auth-middleware';
import { MessageController } from '../../controllers/admin/message.controller';
import { CheckAdminMiddleware } from '../../middleware/check-admin-middleware';
export const messageRoutes = express.Router();

messageRoutes.get("/:roomId",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, MessageController.getMessageOfUser);
messageRoutes.post("/",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, MessageController.addMessage);