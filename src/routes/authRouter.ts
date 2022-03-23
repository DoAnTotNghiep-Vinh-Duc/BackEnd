import express, { NextFunction } from 'express';
import { authController } from '../controllers/AuthController';
export const authRouter = express.Router();
authRouter.get("/auth/google", authController.getAccountGoogle);
authRouter.get("/auth/facebook", authController.getAccountFacebook);
authRouter.post("/signup", authController.registerWebAccount);