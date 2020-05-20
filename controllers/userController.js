const { userModel } = require('models');
const render = require('concerns/render');
const validators = require('./validators');

const updateUserInfo = async (req, res) => {
  const { params, validationError } = validators.validate(req.body, validators.user.updateInfoSchema);
  if (validationError) return render.error(res, validationError);

  const { user, message } = await userModel.updateUserInfo(params);
  if (message) return render.error(res, message);

  return render.success(res, { user });
};

module.exports = {
  updateUserInfo,
};
