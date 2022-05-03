import express from 'express';
import { RateController } from '../controllers/rate-controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const rateRouter = express.Router();
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
rateRouter.get("/all/:productId", RateController.getAllRateProduct);
rateRouter.get("/:productId",AuthMiddleware.verifyAccessToken ,RateController.getRateByAccountAndProduct);
rateRouter.post("/",AuthMiddleware.verifyAccessToken, RateController.createRate);
rateRouter.put("/",AuthMiddleware.verifyAccessToken, RateController.updateRateProduct);
rateRouter.post("/upload-image",upload.any(), RateController.uploadImage);