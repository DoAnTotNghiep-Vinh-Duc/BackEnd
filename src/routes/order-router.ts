import express from 'express';
import { OrderController } from '../controllers/order-controller';
import { CheckPhoneMiddleware } from '../middleware/check-phone-middleware';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const orderRouter = express.Router();

orderRouter.post("/",AuthMiddleware.verifyAccessToken,CheckPhoneMiddleware.checkVerifyPhone, OrderController.createOrder);
orderRouter.post("/by-date", OrderController.getOrdersByDate);
orderRouter.get("/all-top-customer", OrderController.getTopCustomer);
orderRouter.get("/all-top-sell-product", OrderController.getTopSellProduct);
orderRouter.get("/top-customer/:page/:limit", OrderController.getTopCustomerLimitPage);
orderRouter.get("/top-sell-product/:page/:limit", OrderController.getTopSellProductLimitPage);