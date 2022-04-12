import express from 'express';
import { CartController } from '../controllers/cart-controller';
export const cartRouter = express.Router();

cartRouter.put("/add-item", CartController.addItemToCart);
cartRouter.get("/:accountId", CartController.getCartByAccountId);