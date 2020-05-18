const { userModel } = require('models');
const render = require('concerns/render');
const validators = require('./validators');

const updateUserInfo = async (req, res) => {
  const { params, validationError } = validators.validate(req.body, validators.user.updateInfoSchema);
  if (validationError) return render.error(res, validationError);
  const result = await userModel.updateUserInfo(params);
  return render.success(res, result);
};

module.exports = {
  updateUserInfo,
};
