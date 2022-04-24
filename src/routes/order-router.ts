import express from 'express';
import { OrderController } from '../controllers/order-controller';
import { CheckPhoneMiddleware } from '../middleware/check-phone-middleware';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const orderRouter = express.Router();

orderRouter.post("/",AuthMiddleware.verifyAccessToken,CheckPhoneMiddleware.checkVerifyPhone, OrderController.createOrder);