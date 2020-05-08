const FacebookStrategy = require('passport-facebook-token');
const GoogleStrategy = require('passport-google-token').Strategy;

module.exports = async (passport) => {
  const facebookCredentials = { clientID: '754038848413420', clientSecret: '6d0255aa0abd3f68bce0ba4314e16dbd' };
  const googleCredentials = { clientID: '675980225683-slfajh8g6vo2vkjd05128jvgupueqaeq.apps.googleusercontent.com', clientSecret: '0BrDlGV1qAkLPBccaE6Q5C_g' };

  passport.use('facebook', new FacebookStrategy(facebookCredentials, getSocialFields));
  passport.use('google', new GoogleStrategy(googleCredentials, getSocialFields));
};

const getSocialFields = async (access_token, refreshToken, profile, next) => {
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
