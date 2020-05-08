const passport = require('passport');
const render = require('concerns/render');
const { Auth } = require('utilities/authentication');

exports.socialStrategy = async (req, res, next) => {
  require('utilities/authentication/passport')(passport);
  const { provider } = req.params;
  const userFields = await pickFields({
    provider, req, res, next,
  });
  return Auth.socialAuth(Object.assign(userFields));
};

const pickFields = ({
  provider, req, res, next,
}) => new Promise((resolve) => {
  passport.authenticate(provider, (data) => {
    if (!data || !data.fields) return render.unauthorized(res, 'Invalid token');
    resolve(data.fields);
  })(req, res, next);
});
