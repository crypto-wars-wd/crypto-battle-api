const { userModel } = require('models');
const render = require('concerns/render');
const config = require('config');
const { setHiveAccount } = require('utilities/operations').user;
const validators = require('./validators');

const updateUserInfo = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.body, validators.user.updateInfoSchema);
  if (validationError) return render.error(res, validationError);

  const { user, error } = await userModel.updateUserInfo(params);
  if (error) return render.error(res, error);

  return render.success(res, { user });
};

const uploadImage = async (req, res) => res.redirect(307, `${config.waivio}/api/image`);

const linkToHive = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.body, validators.user.linkToHiveSchema);
  if (validationError) return render.error(res, validationError);

  const { user, error } = await setHiveAccount(params);
  if (error) return render.custom(res, error.status, error.message);

  return render.success(res, { user });
};

const getPersonalAccount = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.query, validators.user.getAccountSchema);
  if (validationError) return render.error(res, validationError);

  const { user, error } = await userModel.findOneSelect({
    condition: { _id: params.userID },
    select: '+personalAccount',
  });
  if (error) return render.custom(res, error.status, error.message);

  return render.success(res, { user });
};

module.exports = {
  updateUserInfo,
  uploadImage,
  linkToHive,
  getPersonalAccount,
};
