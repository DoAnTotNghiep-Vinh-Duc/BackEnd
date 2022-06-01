import { ShipperService } from "../../services/admin/shipper.service";
import { Request, Response } from "express";

export class ShipperController {
    static async createShipperAccount (req: Request, res: Response): Promise<any> {
        try {
            const {email,password} = req.body;
            const {name,phone,city, district, ward, street} = req.body;
            const data = await ShipperService.createShipper({email,password}, {name,phone,city, district, ward, street});
            return res.status(data.status).json(data);
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
    
    static async getAllShipperWithOrderQuantity (req: Request, res: Response): Promise<any> {
        try {
            const data = await ShipperService.getAllShipperWithOrderQuantity();
            return res.status(data.status).json(data);
        
        } catch (error: any) {
            return res.status(500).send({
            message: error.message,
            });
        }
    }
}

