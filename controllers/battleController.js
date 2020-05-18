const { battleModel } = require('models');
const render = require('concerns/render');
const getBattleByState = require('utilities/operations').battles;
const validators = require('./validators');


const createBattle = async (req, res) => {
  const { params, validationError } = validators.validate(req.body, validators.battle.createBattleShcema);

  if (validationError) return render.error(res, validationError);
  const result = await battleModel.createNewBattle(params);

  return render.success(res, result);
};

const connectBattle = async (req, res) => {
  const { params, validationError } = validators.validate(req.body, validators.battle.connectBattleShcema);

  if (validationError) return render.error(res, validationError);
  const result = await battleModel.connectBattle(params);

  return render.success(res, result);
};

const statsBattle = async (req, res) => {
  const { params, validationError } = validators.validate(req.body, validators.battle.statsBattleShcema);

  if (validationError) return render.error(res, validationError);
  const result = await battleModel.updateStatsBattle(params);

  return render.success(res, result);
};

const showBattlesByState = async (req, res) => {
  const { params, validationError } = validators.validate(req.query, validators.battle.showBattlesByState);

  if (validationError) return render.error(res, validationError);
  const result = await getBattleByState(params);

  return render.success(res, result);
};

module.exports = {
  createBattle, connectBattle, statsBattle, showBattlesByState,
};
