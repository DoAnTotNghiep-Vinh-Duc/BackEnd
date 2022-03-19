import passport from "passport";
import { googleStrategy } from "../config/googleStrategy";
import { facebookStrategy } from "../config/facebookStrategy";
import { Request, Response } from "express";

passport.use(googleStrategy);
passport.use(facebookStrategy);

const getAccountGoogle = passport.authenticate("google", { scope: ["profile", "email"] });

const getAccountGoogleCB = passport.authenticate("google", {
    session: false,
});

const getAccountFacebook = passport.authenticate("facebook", { failureRedirect: '/login' })

const getAccountFacebookCB = passport.authenticate("facebook", {
    // successRedirect: "/", // Chỗ này là redirect lại cái trang web
    // failureRedirect: "/login/failed",
    session: false,
  })
export const authController = {
    getAccountGoogle,
    getAccountGoogleCB,
    getAccountFacebook,
    getAccountFacebookCB,

};