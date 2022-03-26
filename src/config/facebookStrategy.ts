const FacebookTokenStrategy = require('passport-facebook');
export const facebookStrategy = new FacebookTokenStrategy({
    clientID: `${process.env.facebookID}`,
    clientSecret: `${process.env.facebookSecret}`,
    callbackURL: "/auth/facebook/callback",
  },function (accessToken: string, refreshToken: string, profile: any, done: any) {
    done(null, profile);
}) 