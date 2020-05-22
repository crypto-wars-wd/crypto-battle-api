const { userModel } = require('models');
const render = require('concerns/render');
const validators = require('./validators');

const updateUserInfo = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.body, validators.user.updateInfoSchema);
  if (validationError) return render.error(res, validationError);

  const { user, error } = await userModel.updateUserInfo(params);
  if (error) return render.error(res, error);

  return render.success(res, { user });
};

module.exports = {
  updateUserInfo,
};
