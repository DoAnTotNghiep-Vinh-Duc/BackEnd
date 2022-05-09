import { AccountService } from "../../services/admin/account.service";
import { Request, Response } from "express";

export class AccountController {
    static async getAllAccountWithOrderQuantity (req: Request, res: Response): Promise<any> {
        try {
            const data = await AccountService.getAllAccountWithOrderQuantity();
            return res.status(data.status).json(data);
        
        } catch (error: any) {
            return res.status(500).send({
            message: error.message,
            });
        }
    }
    
}

