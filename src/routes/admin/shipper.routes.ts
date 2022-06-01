import express from 'express';
import { AuthMiddleware } from '../../middleware/auth-middleware';
import { CheckAdminMiddleware } from '../../middleware/check-admin-middleware';
import { ShipperController } from '../../controllers/admin/shipper.controller';
export const shipperRoutes = express.Router();

shipperRoutes.post("/" ,AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin,ShipperController.createShipperAccount);
shipperRoutes.get("/get-all-shipper",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin ,ShipperController.getAllShipperWithOrderQuantity);
