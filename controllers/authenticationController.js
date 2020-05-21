const {
  signInView, validateAuthTokenView,
} = require('views/authenticationController');
const { userModel } = require('models');
const render = require('concerns/render');
const { strategies, logoutUser } = require('utilities/operations');
const { sessions } = require('utilities/authentication');
const validators = require('./validators');

const socialSignIn = async (req, res, next) => {
  const { validationError } = validators.validate(
    Object.assign(req.body, req.params), validators.authentication.socialAuthSchema,
  );

  if (validationError) return render.error(res, validationError);
  const { user, session, errorSignUp } = await strategies.socialStrategy(req, res, next);

  if (errorSignUp) return render.unauthorized(res, errorSignUp);

  sessions.setAuthHeaders(res, user, session);
  return render.success(res, signInView({ user }));
};

const validateAuthToken = async (req, res) => {
  sessions.setAuthHeaders(res, req.auth.user, req.auth.session);
  return render.success(res, validateAuthTokenView({ user: req.auth.user }));
};

const hasSocialAccount = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.query, validators.authentication.hasSocialSchema);

  if (validationError) return render.error(res, validationError);
  const result = await userModel.findUserBySocial(params);

  return render.success(res, !!result);
};

const logout = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.body, validators.authentication.logoutSchema);
  if (validationError) return render.error(res, validationError);

  await logoutUser(req, res, params);

  return render.success(res);
};

module.exports = {
  validateAuthToken,
  hasSocialAccount,
  socialSignIn,
  logout,
};
