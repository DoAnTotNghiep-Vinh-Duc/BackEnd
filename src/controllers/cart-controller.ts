import { CartService } from "../services/cart.service";
import { Request, Response } from "express";

export class CartController {

    static async getCartByAccountId(req: Request, res: Response): Promise<any>{
        try {
            const data = await CartService.getCartByAccountId(req.payload.userId);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).json({
              message: error.message,
            });
        }
    }

    static async addItemToCart(req: Request, res: Response): Promise<any>{
        try {
            const {productDetailId, quantity} = req.body
            
            const data = await CartService.addToCart(req.payload.userId, productDetailId,quantity);
            return res.status(data.status).json(data)
        } catch (error: any) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

    static async removeProductOutCart(req: Request, res: Response): Promise<any>{
        try {
            const {productDetailId} = req.body
            const data = await CartService.removeProductOutCart(req.payload.userId, productDetailId);
            return res.status(data.status).json(data)
        } catch (error: any) {
            return res.status(500).send({
                message: error.message,
            });
        }
    }

    static async increaseQuantity(req: Request, res: Response): Promise<any>{
        try {
            const { productDetailId} = req.body
            const data = await CartService.increaseQuantity(req.payload.userId, productDetailId);
            return res.status(data.status).json(data)
        } catch (error: any) {
            return res.status(500).send({
                message: error.message,
            });
        }
    }

    static async decreaseQuantity(req: Request, res: Response): Promise<any>{
        try {
            const {productDetailId} = req.body
            const data = await CartService.decreaseQuantity(req.payload.userId, productDetailId);
            return res.status(data.status).json(data)
        } catch (error: any) {
            return res.status(500).send({
                message: error.message,
            });
        }
    }
}

