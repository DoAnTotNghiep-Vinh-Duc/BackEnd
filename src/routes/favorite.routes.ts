import express from 'express';
import { FavoriteController } from '../controllers/favorite-controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const favoriteRoutes = express.Router();

favoriteRoutes.get("/",AuthMiddleware.verifyAccessToken, AuthMiddleware.checkAccountIsActive,FavoriteController.getFavoriteByAccountId);
favoriteRoutes.post("/add-favorite",AuthMiddleware.verifyAccessToken ,AuthMiddleware.checkAccountIsActive,FavoriteController.addProductToFavorite);
favoriteRoutes.post("/remove-favorite",AuthMiddleware.verifyAccessToken, AuthMiddleware.checkAccountIsActive,FavoriteController.removeProductFromFavorite);