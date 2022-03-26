
import FacebookTokenStrategy from 'passport-facebook';
export const facebookStrategy = new FacebookTokenStrategy.Strategy({
    clientID: `${process.env.facebookID}`,
    clientSecret: `${process.env.facebookSecret}`,
    callbackURL: "/auth/facebook/callback",
  },function (accessToken: string, refreshToken: string, profile: any, done: any) {
    done(null, profile);
}) 

