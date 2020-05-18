const { battleModel } = require('models');
const render = require('concerns/render');
const validators = require('./validators');

const createBattle = async (req, res) => {
  const { params, validationError } = validators.validate(req.body, validators.battle.createBattleShcema);

  if (validationError) return render.error(res, validationError);
  const result = await battleModel.createNewBattle(params);

  return render.success(res, result);
};

module.exports = {
  createBattle,
};
