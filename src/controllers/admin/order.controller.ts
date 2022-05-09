import { OrderService } from "../../services/admin/order.service";
import { Request, Response } from "express";

export class OrderController {
    static async getOrderByOrderIdAdmin(req: Request, res: Response): Promise<any> {
        try {
            const {orderId} = req.params;
            const data = await OrderService.getOrderByOrderIdAdmin(orderId);
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }

    static async getAllOrderWithUser(req: Request, res: Response): Promise<any> {
        try {
            const data = await OrderService.getAllOrderWithUser();
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

    static async getTopCustomer(req: Request, res: Response): Promise<any> {
        try {
            const data = await OrderService.getTopCustomer();
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
    static async getTopSellProduct(req: Request, res: Response): Promise<any> {
        try {
            const data = await OrderService.getTopSellProduct();
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
    static async sortOrder(req: Request, res: Response): Promise<any> {
        try {
            const typeSort: any = req.query.typeSort;// NAME or TOTALMONEY or ORDERDATE
            const sort: any = req.query.sort; // ASC or DESC
            const typeOrderStatus: any = req.query.typeOrderStatus; // HANDLING or DELIVERING or DONE or CANCELED or ALL
            const data = await OrderService.sortOrder(typeSort, sort, typeOrderStatus);
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
    static async nextStatusOrder(req: Request, res: Response): Promise<any> {
        try {
            const {orderId} = req.params
            const data = await OrderService.nextStatusOrder(orderId);
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
    static async cancelOrder(req: Request, res: Response): Promise<any> {
        try {
            const {orderId} = req.params
            const data = await OrderService.cancelOrder(orderId);
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
    static async paymentWithPayPal(req: Request, res: Response): Promise<any> {
        try {
            const data: any = await OrderService.paymentWithPayPal();
            if(data.status===400){
                res.redirect("localhost:3000/order/cancel")
            }
            return res.redirect(data.link);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
    static async paymentPayPalCacel(req: Request, res: Response): Promise<any> {
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
        try {
            const data: any = await OrderService.paymentWithPayPal();
            if(data.status===400){
                res.redirect("localhost:3000/order/cancel")
            }
            return res.redirect(data.link);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
}

