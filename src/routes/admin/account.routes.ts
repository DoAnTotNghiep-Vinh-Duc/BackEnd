import express from 'express';
import { AuthMiddleware } from '../../middleware/auth-middleware';
import { CheckAdminMiddleware } from '../../middleware/check-admin-middleware';
import { AccountController } from '../../controllers/admin/account.controller';
export const accountRoutes = express.Router();

accountRoutes.get("/get-all-shipper",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin ,AccountController.getAllShipperWithOrderQuantity);
accountRoutes.get("/",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin ,AccountController.getAllAccountWithOrderQuantity);
accountRoutes.get("/filter-account",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin ,AccountController.filterAccountWithOrderQuantity)
accountRoutes.post("/close-account",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin ,AccountController.closeAccount);
accountRoutes.post("/active-account",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin ,AccountController.activeAccount);