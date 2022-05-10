import express from 'express';
import { CartController } from '../controllers/cart-controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const cartRoutes = express.Router();

cartRoutes.put("/add-item",AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive ,CartController.addItemToCart);
cartRoutes.put("/remove-item",AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, CartController.removeProductOutCart);
cartRoutes.get("/",AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, CartController.getCartByAccountId);
cartRoutes.put("/increase-quantity",AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, CartController.increaseQuantity);
cartRoutes.put("/decrease-quantity",AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, CartController.decreaseQuantity);