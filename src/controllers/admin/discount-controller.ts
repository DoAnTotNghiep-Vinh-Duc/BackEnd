import { DiscountService } from "../../services/admin/discount.service";
import { Request, Response } from "express";

export class DiscountController {
    static async getAllDiscount (req: Request, res: Response): Promise<any> {
        try {
            const data = await DiscountService.getAllDiscount();
            return res.status(data.status).json(data);
        
        } catch (error: any) {
            return res.status(500).send({
            message: error.message,
            });
        }
    }
    
    static async createDiscount(req: Request, res: Response): Promise<any> {
        try {
            const {nameDiscount, description, startDate, endDate, percentDiscount} = req.body
            const data = await DiscountService.createDiscount({nameDiscount, description, startDate, endDate, percentDiscount} );
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }

    static async updateDiscount(req: Request, res: Response): Promise<any> {
        try {
            const {_id, nameDiscount, startDate, endDate, percentDiscount} = req.body
            const data = await DiscountService.createDiscount({_id, nameDiscount, startDate, endDate, percentDiscount} );
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }
}

