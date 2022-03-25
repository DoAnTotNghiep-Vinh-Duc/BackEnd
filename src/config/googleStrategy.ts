import { AuthService } from "../services/authentication/AuthService";
import { Response } from "express";
const GoogleTokenStrategy = require('passport-google-token')

export const googleStrategy = new GoogleTokenStrategy.Strategy(
  {
    clientID: `${process.env.googleClientID}`,
    clientSecret: `${process.env.googleClientSecret}`,
    callback: "/auth/google/callback"
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      const data = await AuthService.CreateAccountGoogle(profile);
      console.log(data);
      done(data)
    } catch (error) {
      return {message:"Error when login with google"};
    }
  }
);
