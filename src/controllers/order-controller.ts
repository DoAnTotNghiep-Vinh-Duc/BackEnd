import { OrderService } from "../services/order.service";
import { Request, Response } from "express";

export class OrderController {
    
    static async createOrder(req: Request, res: Response): Promise<any> {
        try {
            const account = req.payload.userId;
            const {listOrderDetail, name, city, district, ward, street, phone} = req.body
            const data = await OrderService.createOrder({account, listOrderDetail, name, city, district, ward, street, phone});
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }

    static async getOrdersByDate(req: Request, res: Response): Promise<any> {
        try {
            const {beginDate, endDate} = req.body;
            const {typeRequest} = req.body;
            const data = await OrderService.getOrdersByDate(typeRequest, beginDate, endDate);
            
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }

    static async getTopCustomerLimitPage(req: Request, res: Response): Promise<any> {
        try {
            const {page, limit} = req.params
            const data = await OrderService.getTopCustomerLimitPage(Number.parseInt(page), Number.parseInt(limit));
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }

    static async getTopSellProductLimitPage(req: Request, res: Response): Promise<any> {
        try {
            const {page, limit} = req.params
            const data = await OrderService.getTopSellProductLimitPage(Number.parseInt(page), Number.parseInt(limit));
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
}

