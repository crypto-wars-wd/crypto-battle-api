const { battleModel } = require('models');
const render = require('concerns/render');
const validators = require('./validators');

const createBattle = async (req, res) => {
  const { params, validationError } = validators.validate(req.body, validators.battle.createBattleShcema);
  if (validationError) return render.error(res, validationError);

  const { battle, message } = await battleModel.createNewBattle(params);
  if (message) return render.error(res, message);

  return render.success(res, { battle });
};

module.exports = {
  createBattle,
};
