import { RateService } from "../services/rate.service";
import { Request, Response } from "express";

export class RateController {
    static async getAllRateProduct (req: Request, res: Response): Promise<any> {
        try {
            const {productId} = req.params
            const data = await RateService.getAllRateProduct(productId);
            return res.status(data.status).json(data);
        
        } catch (error: any) {
            return res.status(500).send({
            message: error.message,
            });
        }
    }
    
    static async getRateByAccountAndProduct(req: Request, res: Response): Promise<any> {
        try {
            const {productId} = req.params
            const {userId} = req.payload
            const data = await RateService.getRateByAccountAndProduct(userId,productId);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }
    
    static async createRate(req: Request, res: Response): Promise<any> {
        try {
            const {productId, point, content, image} = req.body
            const {userId} = req.payload
            const data = await RateService.createRate(userId, productId, {point, content, image});
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }

    static async updateRateProduct(req: Request, res: Response): Promise<any> {
        try {
            const {productId, point, content, image} = req.body
            const {userId} = req.payload
            const data = await RateService.updateRateProduct(userId, productId, {point, content, image});
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }
}

