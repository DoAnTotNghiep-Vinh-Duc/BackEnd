import { ColorService } from "../services/admin/Color.service";
import { Request, Response } from "express";

export class ColorController {
    static async getAllColor (req: Request, res: Response): Promise<any> {
        try {
            ColorService.getAllColor((data: any) => {
            res.status(200).send(data);
            });
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
    
    static async getColorById(req: Request, res: Response): Promise<any> {
        try {
            const colorId = req.params.colorId
            ColorService.getColorById(colorId,(data: any) => {
              res.status(200).send(data);
            });
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
    
    static async updateColorById(req: Request, res: Response): Promise<any> {
        try {
            const colorId = req.params.colorId
            const newColor = req.body
            ColorService.updateColorById(colorId,newColor, (data: any) => {
              res.status(200).send(data);
            });
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }

    static async createColor(req: Request, res: Response): Promise<any> {
        try {
            const newColor = req.body
            ColorService.createColor(newColor, (data: any) => {
              res.status(200).send(data);
            });
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
}

