import express from 'express';
import { FavoriteController } from '../controllers/favorite-controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const favoriteRouter = express.Router();

favoriteRouter.get("/",AuthMiddleware.verifyAccessToken, FavoriteController.getFavoriteByAccountId);
favoriteRouter.post("/add-favorite",AuthMiddleware.verifyAccessToken ,FavoriteController.addProductToFavorite);
favoriteRouter.post("/remove-favorite",AuthMiddleware.verifyAccessToken, FavoriteController.removeProductFromFavorite);