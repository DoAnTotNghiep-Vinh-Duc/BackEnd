import express from 'express';
import { InformationController } from '../controllers/information-controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const informationRoutes = express.Router();

informationRoutes.post("/send-otp",AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, InformationController.sendSmsOTP);
informationRoutes.post("/verify-otp",AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, InformationController.verifyOtpAndUpdateAccount);
informationRoutes.put("/update-information", AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, InformationController.updateInformation);
informationRoutes.get("/", AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, InformationController.getInformationByAccountId);