const { cryptoModel } = require('models');
const render = require('concerns/render');
const { newBattle, getBattleData } = require('utilities/operations');
const validators = require('./validators');

const createBattle = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.body, validators.battle.createBattleSchema);
  if (validationError) return render.error(res, validationError);
  const battle = await newBattle(req, res, params);

  return render.success(res, { battle });
};

const getCryptoCurrencies = async (req, res) => {
  const { crypto, error } = await cryptoModel.findAllCrypto();
  if (error) return render.error(res, error);

  return render.success(res, { crypto });
};

const getTopWarriors = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.query, validators.battle.topWarriorsSchema);
  if (validationError) return render.error(res, validationError);

  const topData = await getBattleData(req, res, params);

  return render.success(res, topData);
};
module.exports = {
  getCryptoCurrencies,
  getTopWarriors,
  createBattle,
};
