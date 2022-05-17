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
            const {nameDiscount, startDate, endDate, percentDiscount} = req.body
            
            const startDateConvert = new Date(startDate)
            const endDateConvert = new Date(endDate)
            const data = await DiscountService.createDiscount({nameDiscount, startDate:startDateConvert, endDate:endDateConvert, percentDiscount} );
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }

    static async updateDiscount(req: Request, res: Response): Promise<any> {
        try {
            const {_id, nameDiscount, startDate, endDate, percentDiscount} = req.body;
            const startDateConvert = new Date(startDate)
            const endDateConvert = new Date(endDate)
            const data = await DiscountService.updateDiscount({_id, nameDiscount, startDate:startDateConvert, endDate:endDateConvert, percentDiscount} );
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }

    static async deleteDiscount(req: Request, res: Response): Promise<any> {
        try {
            const {discountId} = req.params
            const data = await DiscountService.deleteDiscount(discountId);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }
}

