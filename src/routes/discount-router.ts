import express from 'express';
import { DiscountController } from '../controllers/discount-controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const discountRouter = express.Router();

discountRouter.get("/", DiscountController.getAllDiscount);
discountRouter.post("/", DiscountController.createDiscount);