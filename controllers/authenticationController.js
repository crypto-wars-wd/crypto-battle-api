const {
  signInView, validateAuthTokenView,
} = require('views/authenticationController');
const { userModel } = require('models');
const render = require('concerns/render');
const { strategies, logoutUser } = require('utilities/operations').auth;
const { sessions } = require('utilities/authentication');
const validators = require('./validators');

const socialSignIn = async (req, res, next) => {
  const { validationError } = validators.validate(
    Object.assign(req.body, req.params), validators.authentication.socialAuthSchema,
  );

  if (validationError) return render.error(res, validationError);
  const { user, session, error } = await strategies.socialStrategy(req, res, next);

  if (error) return render.unauthorized(res, error);

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

  const {
    successDestroy, getAuthError, findUserError, destroySessionError,
  } = await logoutUser(req, res, params);
  if (getAuthError) return render.unauthorized(res, getAuthError);
  if (findUserError) return render.error(res, findUserError);
  if (destroySessionError) return render.error(res, destroySessionError);

  return render.success(res, successDestroy);
};

module.exports = {
  validateAuthToken,
  hasSocialAccount,
  socialSignIn,
  logout,
};
