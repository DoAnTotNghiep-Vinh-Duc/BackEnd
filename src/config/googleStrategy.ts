const GoogleTokenStrategy = require('passport-google-oauth20')

export const googleStrategy = new GoogleTokenStrategy.Strategy(
  {
    clientID: `${process.env.googleClientID}`,
    clientSecret: `${process.env.googleClientSecret}`,
    callbackURL: "/auth/google/callback",
  },
  (accessToken: any, refreshToken: any, profile: any, done: any) => {

    done(null, profile);
  }
);
