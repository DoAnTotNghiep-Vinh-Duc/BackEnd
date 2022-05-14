import express from 'express';
import { OrderController } from '../../controllers/admin/order.controller';
import { AuthMiddleware } from '../../middleware/auth-middleware';
import { CheckAdminMiddleware } from '../../middleware/check-admin-middleware';
export const orderRoutes = express.Router();


orderRoutes.get("/sortOrder",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.sortOrder); 
orderRoutes.get("/all-order-with-user",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.getAllOrderWithUser);
orderRoutes.post("/by-date",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin,  OrderController.getOrdersByDate);
orderRoutes.get("/all-top-customer",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.getTopCustomer);
orderRoutes.get("/all-top-sell-product",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.getTopSellProduct);
orderRoutes.get("/top-customer/:page/:limit",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.getTopCustomerLimitPage);
orderRoutes.get("/top-sell-product/:page/:limit",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.getTopSellProductLimitPage);
orderRoutes.get("/get-order-by-id/:orderId",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.getOrderByOrderIdAdmin);
orderRoutes.put("/next-status-order/:orderId",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.nextStatusOrder);
orderRoutes.put("/cancel-order/:orderId",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.cancelOrder);