
const render = require('concerns/render');
const validators = require('./validators');
const { replenishAccount } = require('utilities/operations').transfer;

const updateUserBalance = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.body, validators.parserValidator.updateBalanceSchema);
  if (validationError) return render.error(res, validationError);

  const { user, error } = await replenishAccount(params);
  if (error) return render.custom(res, error.status, error.message);

  return render.success(res, user);
};

module.exports = {
  updateUserBalance,
};
