const FacebookStrategy = require('passport-facebook-token');
const GoogleStrategy = require('passport-google-token').Strategy;

module.exports = async (passport) => {
  const facebookCredentials = { clientID: process.env.FACEBOOK_CLIENT_ID || '', clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '' };
  const googleCredentials = { clientID: process.env.GOOGLE_CLIENT_ID || '', clientSecret: process.env.GOOGLE_CLIENT_SECRET || '' };

  passport.use('google', new GoogleStrategy(googleCredentials, getSocialFields));
  passport.use('facebook', new FacebookStrategy(facebookCredentials, getSocialFields));
};

const getSocialFields = async (accessToken, refreshToken, profile, next) => {
  const { provider } = profile;
  const {
    id, name, picture,
  } = profile._json;
  const avatar = picture || (profile.photos && profile.photos[0].value);

  next({
    fields: {
      alias: name, provider, avatar, id,
    },
  });
};
