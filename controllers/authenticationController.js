const {
  signInView, validateAuthTokenView,
} = require('views/authenticationController');
const { userModel } = require('models');
const render = require('concerns/render');
const { strategies } = require('utilities/operations');
const { setAuthHeaders } = require('utilities/authentication/sessions');
const validators = require('./validators');

const socialSignIn = async (req, res, next) => {
  const { validationError } = validators.validate(
    Object.assign(req.body, req.params), validators.authentication.socialAuthShcema,
  );

  if (validationError) return render.error(res, validationError);
  const { user, session, message } = await strategies.socialStrategy(req, res, next);

  if (message) return render.unauthorized(res, message);

  setAuthHeaders(res, user, session);
  return render.success(res, signInView({ user }));
};

const validateAuthToken = async (req, res) => {
  setAuthHeaders(res, req.auth.user, req.auth.session);
  return render.success(res, validateAuthTokenView({ user: req.auth.user }));
};

const hasSocialAccount = async (req, res) => {
  const { params, validationError } = validators.validate(req.query, validators.authentication.hasSocialShcema);

  if (validationError) return render.error(res, validationError);
  const result = await userModel.findUserBySocial(params);

  return render.success(res, !!result);
};

module.exports = {
  hasSocialAccount,
  socialSignIn,
  validateAuthToken,
};
