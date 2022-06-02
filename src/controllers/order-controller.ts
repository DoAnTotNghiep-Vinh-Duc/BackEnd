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

    static async getOrderByAccountId(req: Request, res: Response): Promise<any> {
        try {
            const statusOrder: any = req.query.statusOrder;// status order: 'HANDLING','DELIVERING','DONE','CANCELED', 'ALL'
            const data = await OrderService.getOrderByAccountId(req.payload.userId, statusOrder);
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }

    static async getOrderByAccountShipperId(req: Request, res: Response): Promise<any> {
        try {
            const statusOrder: any = req.query.statusOrder;// status order: 'HANDLING','DELIVERING','DONE','CANCELED', 'ALL'
            const data = await OrderService.getOrderByAccountShipperId(req.payload.userId, statusOrder);
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

    static async cancelOrder(req: Request, res: Response): Promise<any> {
        try {
            const account = req.payload.userId;
            const {orderId} = req.body
            const data = await OrderService.cancelOrder(orderId, account);
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }

    static async paymentWithPayPal(req: Request, res: Response): Promise<any> {
        
    }
    static async paymentPayPalCancel(req: Request, res: Response): Promise<any> {
        try {
            console.log("Cancel");
            return res.redirect("localhost:3000/order/cancel");
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
    static async paymentPayPalSuccess(req: Request, res: Response): Promise<any> {
        
    }
}

