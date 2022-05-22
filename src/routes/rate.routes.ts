import express from 'express';
import { RateController } from '../controllers/rate-controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const rateRoutes = express.Router();
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
rateRoutes.get("/all/:productId", RateController.getAllRateProduct);
rateRoutes.get("/get-product-for-rate/:orderId", AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, RateController.getProductForRateInOrder )
rateRoutes.get("/get-all-rate-by-accountid",AuthMiddleware.verifyAccessToken ,AuthMiddleware.checkAccountIsActive,RateController.getAllRateByAccountId)
rateRoutes.get("/:productId",AuthMiddleware.verifyAccessToken ,AuthMiddleware.checkAccountIsActive,RateController.getRateByAccountAndProduct);
rateRoutes.post("/",AuthMiddleware.verifyAccessToken, AuthMiddleware.checkAccountIsActive,upload.any(), RateController.createRate);
rateRoutes.put("/",AuthMiddleware.verifyAccessToken, AuthMiddleware.checkAccountIsActive,upload.any(),RateController.updateRateProduct);
rateRoutes.post("/upload-image",upload.any(), RateController.uploadImage);