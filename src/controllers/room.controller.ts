import { RoomService } from "../services/room.service";
import { Request, Response } from "express";

export class RoomController {
    static async getRoomChatForUser (req: Request, res: Response): Promise<any> {
        try {
            const data = await RoomService.getRoomChatForUser(req.payload.userId);
            return res.status(data.status).json(data)
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
    
}
