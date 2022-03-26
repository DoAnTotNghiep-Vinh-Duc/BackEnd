import express from 'express';
import { authController } from '../controllers/AuthController';
import { googleStrategy } from "../config/googleStrategy";
import { facebookStrategy } from "../config/facebookStrategy";
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

authRouter.get("/login/success", authController.loginSuccess);

authRouter.get("/login/failed", authController.loginFail);

authRouter.get("/logout", authController.logout);

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