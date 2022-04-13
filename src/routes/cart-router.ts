import express from 'express';
import { CartController } from '../controllers/cart-controller';
export const cartRouter = express.Router();

cartRouter.put("/add-item", CartController.addItemToCart);
cartRouter.put("/remove-item", CartController.removeProductOutCart);
cartRouter.get("/:accountId", CartController.getCartByAccountId);
cartRouter.put("/increase-quantity", CartController.increaseQuantity);
cartRouter.put("/decrease-quantity", CartController.decreaseQuantity);