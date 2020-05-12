const FacebookStrategy = require('passport-facebook-token');
const GoogleStrategy = require('passport-google-token').Strategy;

module.exports = async (passport) => {
  const facebookCredentials = { clientID: process.env.FACEBOOK_CLIENT_ID || '', clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '' };
  const googleCredentials = { clientID: process.env.GOOGLE_CLIENT_ID || '623736583769-qlg46kt2o7gc4kjd2l90nscitf38vl5t.apps.googleusercontent.com', clientSecret: process.env.GOOGLE_CLIENT_SECRET || '7vMRiac-95WEcNbKvubfsqsE' };

  passport.use('google', new GoogleStrategy(googleCredentials, getSocialFields));
  passport.use('facebook', new FacebookStrategy(facebookCredentials, getSocialFields));
};

// eslint-disable-next-line camelcase
const getSocialFields = async (access_token, refreshToken, profile, next) => {
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
