import { OrderService } from "../services/order.service";
import { Request, Response } from "express";

export class OrderController {
    static async getOrderByOrderId(req: Request, res: Response): Promise<any> {
        try {
            const {orderId} = req.params;
            const data = await OrderService.getOrderByOrderId(orderId);
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }

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
}

