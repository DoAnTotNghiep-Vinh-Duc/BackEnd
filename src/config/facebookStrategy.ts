const FacebookTokenStrategy = require('passport-facebook-token');
export const facebookStrategy = new FacebookTokenStrategy({
    clientID: `${process.env.facebookID}`,
    clientSecret: `${process.env.facebookSecret}`,
    fbGraphVersion: 'v3.0',
  },function (accessToken: string, refreshToken: string, profile: any, done: any) {
      console.log(profile)
      return profile;
}) 