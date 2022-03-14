import express from 'express';
import { authController } from '../controllers/AuthController';
export const authRouter = express.Router();

authRouter.get("/auth/google", authController.getAccountGoogle);
authRouter.get("/auth/google/callback", authController.getAccountGoogleCB);
authRouter.get("/auth/facebook", authController.getAccountFacebook);
authRouter.get("/auth/facebook/callback", authController.getAccountFacebookCB);