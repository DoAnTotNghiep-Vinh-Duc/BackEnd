import express, { NextFunction } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { googleStrategy } from "../config/google-strategy";
import { facebookStrategy } from "../config/facebook-strategy";
export const authRouter = express.Router();

import passport from "passport";

passport.use(googleStrategy)
passport.use(facebookStrategy)
passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  done(null, user);
});
const CLIENT_URL = "http://localhost:3000/";

authRouter.get("/login/success", AuthController.loginSuccess);

authRouter.get("/login/failed", AuthController.loginFail);

authRouter.get("/logout", AuthController.logout);

authRouter.get("/google", passport.authenticate("google", { scope: ["profile"] }));

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

authRouter.get("/facebook", passport.authenticate("facebook",));

authRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

authRouter.post("/signup",AuthController.registerWebAccount)
authRouter.post("/signin",AuthController.signInWithWebAccount)