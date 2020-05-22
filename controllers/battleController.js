const { battleModel, cryptoModel } = require('models');
const render = require('concerns/render');
const {
  getBattlesByState, checkStatsBattle, newBattle, getBattleData,
} = require('utilities/operations').battle;
const validators = require('./validators');

const createBattle = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.body, validators.battle.createBattleSchema);
  if (validationError) return render.error(res, validationError);

  const { battle, createBattleError, populateError } = await newBattle(req, res, params);
  if (createBattleError) return render.error(res, createBattleError);
  if (populateError) return render.error(res, populateError);

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

  const { warriors, hasMore, findWarriorsError } = await getBattleData(req, res, params);
  if (findWarriorsError) return render.error(res, findWarriorsError);

  return render.success(res, { warriors, hasMore });
};

const connectBattle = async (req, res) => {
  const { params, validationError } = validators.validate(req.body, validators.battle.connectBattleShcema);
  if (validationError) return render.error(res, validationError);

  const { battle, error } = await battleModel.connectBattle(params);
  if (error) return render.error(res, error);

  return render.success(res, { battle });
};

const saveStatsBattle = async (req, res) => {
  const { params, validationError } = validators.validate(req.body, validators.battle.statsBattleShcema);
  if (validationError) return render.error(res, validationError);

  const { battles, error } = await checkStatsBattle(params);
  if (error) return render.error(res, error);

  return render.success(res, { battles });
};

const showBattlesByState = async (req, res) => {
  const { params, validationError } = validators.validate(req.query, validators.battle.showBattlesByState);
  if (validationError) return render.error(res, validationError);

  const { battles, error } = await getBattlesByState(params);
  if (error) return render.error(res, error);

  return render.success(res, { battles });
};

module.exports = {
  createBattle,
  connectBattle,
  saveStatsBattle,
  showBattlesByState,
  getCryptoCurrencies,
  getTopWarriors,
};
