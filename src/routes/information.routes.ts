import express from 'express';
import { InformationController } from '../controllers/information-controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const informationRoutes = express.Router();
let multer = require("multer"); //the library
let storage = multer.memoryStorage({
    destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
        cb(null, "");
    },
    filename: function (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: any) => void) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});//Configure the place you will upload your file
let upload = multer({ storage: storage });

informationRoutes.post("/send-otp",AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, InformationController.sendSmsOTP);
informationRoutes.post("/verify-otp",AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, InformationController.verifyOtpAndUpdateAccount);
informationRoutes.put("/update-information", AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive,upload.any(), InformationController.updateInformation);
informationRoutes.get("/", AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, InformationController.getInformationByAccountId);