import GoogleStrategy from "passport-google-oauth20";

export const googleStrategy = new GoogleStrategy.Strategy(
  {
    clientID: `${process.env.googleClientID}`,
    clientSecret: `${process.env.googleClientSecret}`,
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
