const { userModel } = require('models');
const render = require('concerns/render');
const config = require('config');
const validators = require('./validators');

const updateUserInfo = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.body, validators.user.updateInfoSchema);
  if (validationError) return render.error(res, validationError);

  const { user, error } = await userModel.updateUserInfo(params);
  if (error) return render.error(res, error);

  return render.success(res, { user });
};

const uploadImage = async (req, res) => res.redirect(307, config.redirectPathImage);

module.exports = {
  updateUserInfo,
  uploadImage,
};
