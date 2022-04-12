import { CartService } from "../services/cart.service";
import { Request, Response } from "express";

export class CartController {
    static async getCartById(req: Request, res: Response): Promise<any> {
        try {
            const CartId = req.params.CartId
            const data = await CartService.getCartById(CartId);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }

    static async getCartByAccountId(req: Request, res: Response): Promise<any>{
        try {
            const accountId = req.params.accountId
            const data = await CartService.getCartByAccountId(accountId);
            console.log("data controller ", data)
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }

    static async addItemToCart(req: Request, res: Response): Promise<any>{
        try {
            const {accountId, productDetailId, quantity} = req.body
            const data = await CartService.addToCart(accountId, productDetailId,quantity);
            return res.status(data.status).json(data.message)
        } catch (error: any) {
            return res.status(500).send({
                message: error.message,
            });
        }
    }

    static async removeProductOutCart(req: Request, res: Response): Promise<any>{
        try {
            const {accountId, productDetailId} = req.body
            const data = await CartService.removeProductOutCart(accountId, productDetailId);
            return res.status(data.status).json(data.message)
        } catch (error: any) {
            return res.status(500).send({
                message: error.message,
            });
        }
    }

    static async increaseQuantity(req: Request, res: Response): Promise<any>{
        try {
            const {accountId, productDetailId} = req.body
            const data = await CartService.increaseQuantity(accountId, productDetailId);
            return res.status(data.status).json(data.message)
        } catch (error: any) {
            return res.status(500).send({
                message: error.message,
            });
        }
    }

    static async decreaseQuantity(req: Request, res: Response): Promise<any>{
        try {
            const {accountId, productDetailId} = req.body
            const data = await CartService.decreaseQuantity(accountId, productDetailId);
            return res.status(data.status).json(data.message)
        } catch (error: any) {
            return res.status(500).send({
                message: error.message,
            });
        }
    }
}

