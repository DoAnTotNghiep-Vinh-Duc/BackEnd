const FacebookTokenStrategy = require('passport-facebook-token');
import { AuthService } from "../services/authentication/AuthService";
export const facebookStrategy = new FacebookTokenStrategy({
    clientID: `${process.env.facebookID}`,
    clientSecret: `${process.env.facebookSecret}`,
    fbGraphVersion: 'v3.0',
  },
  async function (accessToken: string, refreshToken: string, profile: any, done: any) {
    try {
      await AuthService.CreateAccountFacebook(profile,(data: any)=>{
        return data
      });
    } catch (error) {
      return {message:"Error when login with facebook"};
    }
  }
) 