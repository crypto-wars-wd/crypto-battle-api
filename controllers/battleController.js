const { battleModel, cryptoModel } = require('models');
const render = require('concerns/render');
const validators = require('./validators');

const createBattle = async (req, res) => {
  const { params, validationError } = validators.validate(req.body, validators.battle.createBattleShcema);

  if (validationError) return render.error(res, validationError);
  const result = await battleModel.createNewBattle(params);

  return render.success(res, result);
};

const getCryptoCurrencies = async (req, res) => {
  const result = await cryptoModel.findAllCrypto();

  return render.success(res, result);
};
module.exports = {
  createBattle,
  getCryptoCurrencies,
};
