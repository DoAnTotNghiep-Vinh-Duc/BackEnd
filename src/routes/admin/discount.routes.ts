import express from 'express';
import { CheckAdminMiddleware } from '../../middleware/check-admin-middleware';
import { DiscountController } from '../../controllers/admin/discount-controller';
import { AuthMiddleware } from '../../middleware/auth-middleware';
export const discountRoutes = express.Router();

discountRoutes.get("/", AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, DiscountController.getAllDiscount);
discountRoutes.post("/",  DiscountController.createDiscount);
discountRoutes.put("/", AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, DiscountController.updateDiscount)