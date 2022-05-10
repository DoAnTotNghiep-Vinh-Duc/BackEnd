import express from 'express';
import { CartController } from '../controllers/cart-controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const cartRoutes = express.Router();

cartRoutes.put("/add-item",AuthMiddleware.verifyAccessToken, CartController.addItemToCart);
cartRoutes.put("/remove-item",AuthMiddleware.verifyAccessToken, CartController.removeProductOutCart);
cartRoutes.get("/",AuthMiddleware.verifyAccessToken, CartController.getCartByAccountId);
cartRoutes.put("/increase-quantity",AuthMiddleware.verifyAccessToken, CartController.increaseQuantity);
cartRoutes.put("/decrease-quantity",AuthMiddleware.verifyAccessToken, CartController.decreaseQuantity);