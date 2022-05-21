import express from 'express';
import { AuthMiddleware } from '../../middleware/auth-middleware';
import { RoomController } from '../../controllers/admin/room.controller';
import { CheckAdminMiddleware } from '../../middleware/check-admin-middleware';
export const roomRoutes = express.Router();

roomRoutes.get("/",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, RoomController.getAllRoomAdmin);