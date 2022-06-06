import { ShipperService } from "../services/shipper.service";
import { Request, Response } from "express";

export class ShipperController {
    static async receiveOrder (req: Request, res: Response): Promise<any> {
        try {
            const accountId = req.payload.userId
            const {orderId} = req.body;
            const data = await ShipperService.receiveOrder(accountId,orderId);
            return res.status(data.status).json(data);
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
    static async finishOrder (req: Request, res: Response): Promise<any> {
        try {
            const accountId = req.payload.userId
            const {orderId} = req.body;
            // const uploadFile = req.files;
            const data = await ShipperService.finishOrder(accountId,orderId);
            // const data = await ShipperService.finishOrder(accountId,JSON.parse(orderId), uploadFile);
            return res.status(data.status).json(data);
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }

    static async cancelOrder (req: Request, res: Response): Promise<any> {
        try {
            const {orderId} = req.body;
            const data = await ShipperService.cancelOrder(orderId);
            return res.status(data.status).json(data);
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
}

