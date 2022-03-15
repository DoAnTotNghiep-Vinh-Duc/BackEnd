import { SizeService } from "../../services/admin/SizeService";
import { Request, Response } from "express";

export class SizeController {
    static async getAllSize (req: Request, res: Response): Promise<any> {
        try {
            SizeService.getAllSize((data: any) => {
            res.status(200).send(data);
            });
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
    
    static async getSizeById(req: Request, res: Response): Promise<any> {
        try {
            const sizeId = req.params.sizeId
            SizeService.getSizeById(sizeId,(data: any) => {
              res.status(200).send(data);
            });
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
    
    static async updateSizeById(req: Request, res: Response): Promise<any> {
        try {
            const sizeId = req.params.sizeId
            const newSize = req.body
            SizeService.updateSizeById(sizeId,newSize, (data: any) => {
              res.status(200).send(data);
            });
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }

    static async createSize(req: Request, res: Response): Promise<any> {
        try {
            const newSize = req.body
            SizeService.createSize(newSize, (data: any) => {
              res.status(200).send(data);
            });
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
}

