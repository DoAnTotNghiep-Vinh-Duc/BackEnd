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

    static async getInformationByAccountId(req: Request, res: Response): Promise<any> {
        try {
            const accountId = req.payload.userId
            const data = await InformationService.getInformationByAccountId(accountId);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }

    static async updateInformation(req: Request, res: Response): Promise<any> {
        try {
            const accountId = req.payload.userId;
            const {newInformation} = req.body;
            const uploadFile = req.files;
            const data = await InformationService.updateInformation(accountId,JSON.parse(newInformation), uploadFile);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              message: error.message,
            });
        }
    }
}

