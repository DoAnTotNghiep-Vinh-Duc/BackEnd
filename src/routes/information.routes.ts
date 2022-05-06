import express from 'express';
import { InformationController } from '../controllers/information-controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const informationRoutes = express.Router();

informationRoutes.post("/send-otp",AuthMiddleware.verifyAccessToken, InformationController.sendSmsOTP);
informationRoutes.post("/verify-otp",AuthMiddleware.verifyAccessToken, InformationController.verifyOtpAndUpdateAccount);
informationRoutes.put("/update-information", AuthMiddleware.verifyAccessToken, InformationController.updateInformation);
informationRoutes.get("/", AuthMiddleware.verifyAccessToken, InformationController.getInformationByAccountId);