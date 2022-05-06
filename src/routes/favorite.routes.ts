import express from 'express';
import { FavoriteController } from '../controllers/favorite-controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const favoriteRoutes = express.Router();

favoriteRoutes.get("/",AuthMiddleware.verifyAccessToken, FavoriteController.getFavoriteByAccountId);
favoriteRoutes.post("/add-favorite",AuthMiddleware.verifyAccessToken ,FavoriteController.addProductToFavorite);
favoriteRoutes.post("/remove-favorite",AuthMiddleware.verifyAccessToken, FavoriteController.removeProductFromFavorite);