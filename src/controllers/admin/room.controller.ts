import { RoomService } from "../../services/admin/room.service";
import { Request, Response } from "express";

export class RoomController {
    static async getAllRoomAdmin (req: Request, res: Response): Promise<any> {
        try {
            const data = await RoomService.getAllRoomAdmin();
            return res.status(data.status).json(data)
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
    
}
