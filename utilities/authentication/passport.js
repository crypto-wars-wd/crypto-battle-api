const FacebookStrategy = require('passport-facebook-token');
const GoogleStrategy = require('passport-google-token').Strategy;

module.exports = async (passport) => {
  const facebookCredentials = { clientID: process.env.FACEBOOK_CLIENT_ID || '2848509168579400', clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'c933793375014feb38ebd25b019479a7' };
  const googleCredentials = { clientID: process.env.GOOGLE_CLIENT_ID || '675980225683-slfajh8g6vo2vkjd05128jvgupueqaeq.apps.googleusercontent.com', clientSecret: process.env.GOOGLE_CLIENT_SECRET || '0BrDlGV1qAkLPBccaE6Q5C_g' };

  passport.use('google', new GoogleStrategy(googleCredentials, getSocialFields));
  passport.use('facebook', new FacebookStrategy(facebookCredentials, getSocialFields));
};

// eslint-disable-next-line camelcase
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
