const GoogleTokenStrategy = require('passport-google-token')

export const googleStrategy = new GoogleTokenStrategy.Strategy(
  {
    clientID: `${process.env.googleClientID}`,
    clientSecret: `${process.env.googleClientSecret}`,
  },
  (accessToken: any, refreshToken: any, profile: any, done: any) => {

    if (profile.id) {
        console.log("AccessToken:",accessToken);
        console.log(profile)
        return profile;
    }
  }
);
