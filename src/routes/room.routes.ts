import express from 'express';
import { AuthMiddleware } from '../middleware/auth-middleware';
import { RoomController } from '../controllers/room.controller';
export const roomRoutes = express.Router();

roomRoutes.get("/",AuthMiddleware.verifyAccessToken, AuthMiddleware.checkAccountIsActive, RoomController.getRoomChatForUser);