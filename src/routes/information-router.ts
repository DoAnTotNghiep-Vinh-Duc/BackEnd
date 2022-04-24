import express from 'express';
import { InformationController } from '../controllers/information-controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const informationRouter = express.Router();

informationRouter.post("/send-otp",AuthMiddleware.verifyAccessToken, InformationController.sendSmsOTP);
informationRouter.post("/verify-otp",AuthMiddleware.verifyAccessToken, InformationController.verifyOtpAndUpdateAccount);
informationRouter.put("/update-information", AuthMiddleware.verifyAccessToken, InformationController.updateInformation);