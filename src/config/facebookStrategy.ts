import FacebookStrategy from "passport-facebook";
export const facebookStrategy = new FacebookStrategy.Strategy({
    clientID: '484133043279715',
    clientSecret: '300808d3db109dbf9b782ffa0d9425fa',
    callbackURL: "/auth/facebook/callback",
    enableProof: true,
    profileFields: ['id', 'displayName', 'picture.type(large)', 'email', 'birthday', 'friends', 'first_name', 'last_name', 'middle_name', 'gender', 'link']
  },function (accessToken, refreshToken, profile, done) {
      console.log(profile)
    done(null, profile);
}) 