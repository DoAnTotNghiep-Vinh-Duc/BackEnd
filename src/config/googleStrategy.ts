import { AuthService } from "../services/authentication/AuthService";

const GoogleTokenStrategy = require('passport-google-token')

export const googleStrategy = new GoogleTokenStrategy.Strategy(
  {
    clientID: `${process.env.googleClientID}`,
    clientSecret: `${process.env.googleClientSecret}`,
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      await AuthService.CreateAccountGoogle(profile,(data: any)=>{
        return data
      });
    } catch (error) {
      return {message:"Error when login with facebook"};
    }
  }
);
