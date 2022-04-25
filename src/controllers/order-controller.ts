import { OrderService } from "../services/order.service";
import { Request, Response } from "express";

export class OrderController {
    
    static async createOrder(req: Request, res: Response): Promise<any> {
        try {
            const account = req.payload.userId;
            const {listOrderDetail, name, address, phone} = req.body
            const data = await OrderService.createOrder({account, listOrderDetail, name, address, phone});
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
}

