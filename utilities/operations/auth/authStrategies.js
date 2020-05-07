const _ = require('lodash');
const passport = require('passport');
const render = require('concerns/render');
const { Auth } = require('utilities/authentication');

exports.socialStrategy = async (req, res, next) => {
  require('utilities/authentication/passport')(passport);
  const provider = req.route.path.match(/[a-z].*/)[0];
  const userFields = await pickFields({
    provider, req, res, next,
  });
  const nightMode = _.get(req, 'headers.nightmode', false);

  return await Auth.socialAuth(Object.assign(userFields, { nightMode }));
};

const pickFields = async ({
  provider, req, res, next,
}) => await new Promise((resolve) => {
  passport.authenticate(provider, (data) => {
    if (!data || !data.fields) return render.unauthorized(res, 'Invalid token');
    const {
      userName, avatar, alias, locales,
    } = req.body;

    data.fields.email = req.body.allowEmail ? data.fields.email : null;
    data.fields.userName = userName;
    data.fields.avatar = avatar;
    data.fields.alias = alias || '';
    data.fields.postLocales = locales || ['en-US'];

    resolve(data.fields);
  })(req, res, next);
});
