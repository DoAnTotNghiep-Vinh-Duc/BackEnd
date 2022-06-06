import express from 'express';
import { ShipperController } from '../controllers/shipper.controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const shipperRoutes = express.Router();
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
shipperRoutes.post("/receive-order",AuthMiddleware.verifyAccessToken, AuthMiddleware.checkAccountIsActive, ShipperController.receiveOrder);
shipperRoutes.post("/finish-order",AuthMiddleware.verifyAccessToken, AuthMiddleware.checkAccountIsActive, ShipperController.finishOrder);
shipperRoutes.post("/cancel-order",AuthMiddleware.verifyAccessToken, AuthMiddleware.checkAccountIsActive, ShipperController.cancelOrder);