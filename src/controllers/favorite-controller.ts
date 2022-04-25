import { FavoriteService } from "../services/favorites.service";
import { Request, Response } from "express";

export class FavoriteController {
    static async getFavoriteByAccountId (req: Request, res: Response): Promise<any> {
        try {
            const {userId} = req.payload
            const data = await FavoriteService.getFavoriteByAccountId(userId);
            return res.status(data.status).json(data);
        
        } catch (error: any) {
            return res.status(500).send({
            message: error.message,
            });
        }
    }
    
    static async addProductToFavorite(req: Request, res: Response): Promise<any> {
        try {
            const {userId} = req.payload;
            const {productId} = req.body;
            const data = await FavoriteService.addProductToFavorite(userId, productId);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }
    
    static async removeProductFromFavorite(req: Request, res: Response): Promise<any> {
        try {
            const {userId} = req.payload;
            const {productId} = req.body;
            const data = await FavoriteService.removeProductFromFavorite(userId,productId);
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }
}

