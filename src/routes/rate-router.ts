import express from 'express';
import { RateController } from '../controllers/rate-controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
export const rateRouter = express.Router();

rateRouter.get("/all/:productId", RateController.getAllRateProduct);
rateRouter.get("/:productId",AuthMiddleware.verifyAccessToken ,RateController.getRateByAccountAndProduct);
rateRouter.post("/",AuthMiddleware.verifyAccessToken, RateController.createRate);
rateRouter.put("/",AuthMiddleware.verifyAccessToken, RateController.updateRateProduct);