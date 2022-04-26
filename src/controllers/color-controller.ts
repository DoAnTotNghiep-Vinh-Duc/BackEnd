import { ColorService } from "../services/color.service";
import { Request, Response } from "express";

export class ColorController {
    static async getAllColor (req: Request, res: Response): Promise<any> {
        try {
            const data = await ColorService.getAllColor();
            return res.status(data.status).json(data);
        
        } catch (error: any) {
            return res.status(500).send({
            message: error.message,
            });
        }
    }
    
    static async getColorById(req: Request, res: Response): Promise<any> {
        try {
            const colorId = req.params.colorId
            const data = await ColorService.getColorById(colorId);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }
    
    static async updateColorById(req: Request, res: Response): Promise<any> {
        try {
            const colorId = req.params.colorId
            const newColor = req.body
            const data = await ColorService.updateColorById(colorId,newColor);
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }

    static async createColor(req: Request, res: Response): Promise<any> {
        try {
            const newColor = req.body
            const data = await ColorService.createColor(newColor);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }
}

