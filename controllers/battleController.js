const { battleModel } = require('models');
const render = require('concerns/render');
const validators = require('./validators');

const createBattle = async (req, res) => {
  // const { params, validationError } = validators.validate(req.query, validators.authentication.hasSocialShcema);

  // if (validationError) return render.error(res, validationError);
  const result = await battleModel.createNewBattle(req.body);

  return render.success(res, result);
};

module.exports = {
  createBattle,
};
