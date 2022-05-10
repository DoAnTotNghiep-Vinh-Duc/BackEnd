import express from 'express';
import { OrderController } from '../controllers/order-controller';
import { CheckPhoneMiddleware } from '../middleware/check-phone-middleware';
import { AuthMiddleware } from '../middleware/auth-middleware';
import paypal from "paypal-rest-sdk"
export const orderRoutes = express.Router();
orderRoutes.post("/",AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive,CheckPhoneMiddleware.checkVerifyPhone, OrderController.createOrder);
orderRoutes.get("/get-order-by-account", AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, OrderController.getOrderByAccountId)
orderRoutes.get("/get-order-by-orderId/:orderId", AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, OrderController.getOrderByOrderId)