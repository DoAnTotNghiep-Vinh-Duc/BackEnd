import { MessageService } from "../../services/admin/message.service";
import { Request, Response } from "express";

export class MessageController {
    static async getMessageOfUser (req: Request, res: Response): Promise<any> {
        try {
            const roomId = req.params.roomId
            const data = await MessageService.getMessageByRoomId(roomId);
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
            const {roomId} = req.body
            console.log(text, roomId);
            
            const data = await MessageService.addMessageAdmin(roomId,req.payload.userId, {text}, req.io);
            return res.status(data.status).json(data)
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
}
