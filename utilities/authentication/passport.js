const FacebookStrategy = require('passport-facebook-token');
const GoogleStrategy = require('passport-google-token').Strategy;

module.exports = async (passport) => {
  const facebookCredentials = { clientID: process.env.FACEBOOK_APP_ID, clientSecret: process.env.FACEBOOK_APP_SECRET };
  const googleCredentials = { clientID: process.env.GOOGLE_APP_ID, clientSecret: process.env.GOOGLE_APP_SECRET };

  passport.use('facebook', new FacebookStrategy(facebookCredentials, getSocialFields));
  passport.use('google', new GoogleStrategy(googleCredentials, getSocialFields));
};

const getSocialFields = async (accessToken, refreshToken, profile, next) => {
  const { provider } = profile;
  const {
    id, name, picture, email,
  } = profile._json;
  const avatar = picture || profile.photos && profile.photos[0].value;

  next({
    fields: {
      alias: name, provider, avatar, id, email,
    },
  });
};
