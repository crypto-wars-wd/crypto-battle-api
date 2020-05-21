const { userModel } = require('models');
const render = require('concerns/render');
const validators = require('./validators');

const updateUserInfo = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.body, validators.user.updateInfoSchema);
  if (validationError) return render.error(res, validationError);

  const { user, updateError } = await userModel.updateUserInfo(params);
  if (updateError) return render.error(res, updateError);

  return render.success(res, { user });
};

module.exports = {
  updateUserInfo,
};
