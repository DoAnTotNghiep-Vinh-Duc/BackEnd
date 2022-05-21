import { MessageService } from "../services/message.service";
import { Request, Response } from "express";

export class MessageController {
    static async getMessageOfUser (req: Request, res: Response): Promise<any> {
        try {
            console.log(req.payload.userId);
            
            const data = await MessageService.getMessageOfUser(req.payload.userId);
            return res.status(data.status).json(data)
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
    
    static async addMessage (req: Request, res: Response): Promise<any> {
        try {
            const {text} = req.body
            const data = await MessageService.addMessage(req.payload.userId, {text}, req.io);
            return res.status(data.status).json(data)
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
}
