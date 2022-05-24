import express, { NextFunction } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { googleStrategy } from "../config/google-strategy";
import { facebookStrategy } from "../config/facebook-strategy";
export const authRoutes = express.Router();

import passport from "passport";
import { AuthMiddleware } from '../middleware/auth-middleware';

passport.use(googleStrategy)
passport.use(facebookStrategy)
passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  done(null, user);
});
const CLIENT_URL = `${process.env.DOMAIN_FRONTEND}/`;

authRoutes.get("/login/success", AuthController.loginSuccess);

authRoutes.get("/login/failed", AuthController.loginFail);

authRoutes.post("/logout", AuthController.logout);

authRoutes.get("/google", passport.authenticate("google", { scope: ["profile"] }));

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

authRoutes.get("/facebook", passport.authenticate("facebook",));

authRoutes.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

authRoutes.post("/signup",AuthController.registerWebAccount);
authRoutes.post("/signin",AuthController.signInWithWebAccount);
authRoutes.post("/verify-account-web", AuthController.verifyAccountWeb);

authRoutes.post("/verify-refresh-token", AuthController.verifyRefreshToken)
authRoutes.put("/change-password",AuthMiddleware.verifyAccessToken ,AuthController.changePassword)
authRoutes.post("/send-mail-forgot-password", AuthController.sendMailforForgotPassword);
authRoutes.post("/verify-forgot-password", AuthController.verifyForgotPassword);