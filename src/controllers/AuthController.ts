import passport from "passport";
import { googleStrategy } from "../config/googleStrategy";
import { facebookStrategy } from "../config/facebookStrategy";
import { Request, Response } from "express";

passport.use(googleStrategy);
passport.use(facebookStrategy);
export class authController{

    static getAccountGoogle = passport.authenticate("google", { scope: ["profile", "email"] });
    
    static getAccountGoogleCB = passport.authenticate("google", {
        session: false,
    });
    
    static getAccountFacebook = passport.authenticate("facebook", { failureRedirect: '/login' })
    
    static getAccountFacebookCB = passport.authenticate("facebook", {
        // successRedirect: "/", // Chỗ này là redirect lại cái trang web
        // failureRedirect: "/login/failed",
        session: false,
      })
}
