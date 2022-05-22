import { RateService } from "../services/rate.service";
import { Request, Response } from "express";
import util from 'util';
export class RateController {
    static async uploadImage (req: Request, res: Response): Promise<any> {
        try {
            const uploadFile = req.files;
            const data = await RateService.uploadImage(uploadFile);
            const kaka = req.body
            console.log("kaka",kaka);
            
            return res.status(data.status).json(data);
        
        } catch (error: any) {
            console.log(error);
            
            return res.status(500).send({
            message: error.message,
            });
        }
    }

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

    static async getProductForRateInOrder(req: Request, res: Response): Promise<any> {
        try {
            const {orderId} = req.params
            const {userId} = req.payload
            const data = await RateService.getProductForRateInOrder(userId,orderId);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }
    
    static async createRate(req: Request, res: Response): Promise<any> {
        try {
            const {rateInfo} = req.body
            console.log("rateInfo",rateInfo);
            
            //rateInfo: {productId, point, content}
            const {userId} = req.payload
            const uploadFile = req.files;
            console.log("uploadFile",uploadFile);
            
            const data = await RateService.createRate(userId, uploadFile, JSON.parse(rateInfo) );
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            console.log("Controller",error);
            
            return res.status(500).send({
              message: error.message,
            });
        }
    }

    static async updateRateProduct(req: Request, res: Response): Promise<any> {
        try {
            const {newRate} = req.body
            const {userId} = req.payload
            const uploadFile = req.files;
            const data = await RateService.updateRateProduct(userId, newRate, uploadFile);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }

    static async getAllRateByAccountId(req: Request, res: Response): Promise<any> {
        try {
            const {userId} = req.payload
            const data = await RateService.getAllRateByAccountId(userId);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }

    static async getRateByRateId(req: Request, res: Response): Promise<any> {
        try {
            const {userId} = req.payload;
            const {rateId} = req.params;
            const data = await RateService.getRateByRateId(userId, rateId);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }
}

