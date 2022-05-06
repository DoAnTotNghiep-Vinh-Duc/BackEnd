import express from 'express';
import { DiscountController } from '../controllers/discount-controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const discountRoutes = express.Router();

discountRoutes.get("/", DiscountController.getAllDiscount);
discountRoutes.post("/", DiscountController.createDiscount);