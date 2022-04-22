import express from 'express';
import { CartController } from '../controllers/cart-controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const cartRouter = express.Router();

cartRouter.put("/add-item",AuthMiddleware.verifyAccessToken, CartController.addItemToCart);
cartRouter.put("/remove-item",AuthMiddleware.verifyAccessToken, CartController.removeProductOutCart);
cartRouter.get("/:accountId",AuthMiddleware.verifyAccessToken, CartController.getCartByAccountId);
cartRouter.put("/increase-quantity",AuthMiddleware.verifyAccessToken, CartController.increaseQuantity);
cartRouter.put("/decrease-quantity",AuthMiddleware.verifyAccessToken, CartController.decreaseQuantity);