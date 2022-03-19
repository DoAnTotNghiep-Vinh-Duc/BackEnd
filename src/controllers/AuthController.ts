import passport from "passport";
import { googleStrategy } from "../config/googleStrategy";
import { facebookStrategy } from "../config/facebookStrategy";
import { Request, Response } from "express";

passport.use(googleStrategy);
passport.use(facebookStrategy);

export class AuthController{
    static getAccountGoogle (){
        return passport.authenticate("google", { scope: ["profile", "email"] });
    }
    
    static getAccountGoogleCB(){
    return passport.authenticate("google", {
            session: false,
        });
    } 
    
    static getAccountFacebook(){
        return passport.authenticate("facebook", { failureRedirect: '/login' })
    } 
    
    static getAccountFacebookCB (){ 
        return passport.authenticate("facebook", {
            // successRedirect: "/", // Chỗ này là redirect lại cái trang web
            // failureRedirect: "/login/failed",
            session: false,
        })
    }
}