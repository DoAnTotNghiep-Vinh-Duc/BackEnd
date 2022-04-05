import { AuthService } from '../services/authentication/auth.service';
import GoogleTokenStrategy from 'passport-google-oauth20';

export const googleStrategy = new GoogleTokenStrategy.Strategy(
  {
    clientID: `${process.env.googleClientID}`,
    clientSecret: `${process.env.googleClientSecret}`,
    callbackURL: "/auth/google/callback",
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    const googleAccount = await AuthService.createAccountGoogle(profile);
    done(null, googleAccount);
  }
);
