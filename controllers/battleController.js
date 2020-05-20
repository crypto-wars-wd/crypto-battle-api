const { battleModel, cryptoModel, userModel } = require('models');
const render = require('concerns/render');
const { getBattlesByState, checkResultBattle } = require('utilities/operations').battles;
const validators = require('./validators');

const createBattle = async (req, res) => {
  const { params, validationError } = validators.validate(req.body, validators.battle.createBattleShcema);
  if (validationError) return render.error(res, validationError);

  const { battle, message } = await battleModel.createNewBattle(params);
  if (message) return render.error(res, message);

  return render.success(res, { battle });
};

const getCryptoCurrencies = async (req, res) => {
  const { crypto, message } = await cryptoModel.findAllCrypto();
  if (message) return render.error(res, message);

  return render.success(res, { crypto });
};

const getTopWarriors = async (req, res) => {
  const { warriors, message } = await userModel.findTopWarriors();
  if (message) return render.error(res, message);

  return render.success(res, { warriors });
};

const connectBattle = async (req, res) => {
  const { params, validationError } = validators.validate(req.body, validators.battle.connectBattleShcema);
  if (validationError) return render.error(res, validationError);

  const { battle, message } = await battleModel.connectBattle(params);
  if (message) return render.error(res, message);

  return render.success(res, { battle });
};

const saveStatsBattle = async (req, res) => {
  const { params, validationError } = validators.validate(req.body, validators.battle.statsBattleShcema);
  if (validationError) return render.error(res, validationError);

  const { battle, message } = await battleModel.updateStatsBattle(params);
  if (message) return render.error(res, message);
  if (battle.gameStatus === 'END') {
    const { error } = await checkResultBattle(battle);
    if (error) return render.error(res, message);
  }

  return render.success(res, { battle });
};

const showBattlesByState = async (req, res) => {
  const { params, validationError } = validators.validate(req.query, validators.battle.showBattlesByState);
  if (validationError) return render.error(res, validationError);

  const { battles, message } = await getBattlesByState(params);
  if (message) return render.error(res, message);

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
