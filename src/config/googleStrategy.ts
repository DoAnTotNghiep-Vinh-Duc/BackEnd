import GoogleStrategy from "passport-google-oauth20";


export const googleStrategy = new GoogleStrategy.Strategy(
  {
    clientID: '334725893158-2nu8k88u4995j21q2bvooa5aabg9lg7l.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "/auth/google/callback",
  },
  (accessToken: any, refreshToken: any, profile: any, done: any) => {

    if (profile.id) {
        console.log("AccessToken:",accessToken);
        console.log(profile)
        done(profile)
    }
  }
);
