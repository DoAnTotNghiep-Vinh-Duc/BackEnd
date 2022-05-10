import express from 'express';
import { AuthMiddleware } from '../../middleware/auth-middleware';
import { CheckAdminMiddleware } from '../../middleware/check-admin-middleware';
import { AccountController } from '../../controllers/admin/account.controller';
export const accountRoutes = express.Router();

accountRoutes.get("/",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin ,AccountController.getAllAccountWithOrderQuantity);
accountRoutes.post("/close-account",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin ,AccountController.getAllAccountWithOrderQuantity);
accountRoutes.post("/active-account",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin ,AccountController.getAllAccountWithOrderQuantity);