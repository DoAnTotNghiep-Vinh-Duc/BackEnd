import { InformationService } from "../services/information.service";
import { Request, Response } from "express";

export class InformationController {
    
    static async sendSmsOTP(req: Request, res: Response): Promise<any> {
        try {
            const {phone} = req.body
            const data = await InformationService.sendSmsOTP(phone);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }
    
    static async verifyOtpAndUpdateAccount(req: Request, res: Response): Promise<any> {
        try {
            const {phone, otp} = req.body
            const accountId = req.payload.userId
            const data = await InformationService.verifyOtpAndUpdateAccount(accountId,phone, otp);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }
}

