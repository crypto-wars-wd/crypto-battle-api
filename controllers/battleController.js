const { battleModel, cryptoModel, userModel } = require('models');
const render = require('concerns/render');
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
module.exports = {
  getCryptoCurrencies,
  getTopWarriors,
  createBattle,
};
