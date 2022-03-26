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
// authRouter.get("/auth/google", authController.getAccountGoogle);
// authRouter.get("/auth/facebook", authController.getAccountFacebook);
const CLIENT_URL = "http://localhost:3000/";

authRouter.get("/login/success", (req, res) => {
  if (req.user) {
      console.log(req.user)
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
  }
});

authRouter.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

authRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

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