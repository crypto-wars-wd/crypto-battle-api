const render = require('concerns/render');
const {
  newBattle,
  getCryptoData,
  getBattlesData,
  connectToBattle,
  getWarriorsData,
  handleCancelBattle,
  handleUpdateBattles,
} = require('utilities/operations').battle;
const validators = require('./validators');

const createBattle = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.body, validators.battle.createBattleSchema);
  if (validationError) return render.error(res, validationError);

  const { battle, error } = await newBattle(req, res, params);
  if (error) return render.custom(res, error.status, error.message);

  return render.success(res, { battle });
};

const getCryptoCurrencies = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.query, validators.battle.topCryptoSchema);
  if (validationError) return render.error(res, validationError);

  const { crypto, hasMore, error } = await getCryptoData(req, res, params);
  if (error) return render.custom(res, error.status, error.message);

  return render.success(res, { crypto, hasMore });
};

const getTopWarriors = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.query, validators.battle.topWarriorsSchema);
  if (validationError) return render.error(res, validationError);

  const { warriors, hasMore, error } = await getWarriorsData(req, res, params);
  if (error) return render.custom(res, error.status, error.message);

  return render.success(res, { warriors, hasMore });
};

const connectBattle = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.body, validators.battle.connectBattleShcema);
  if (validationError) return render.error(res, validationError);

  const { battle, error } = await connectToBattle(params);
  if (error) return render.custom(res, error.status, error.message);

  return render.success(res, { battle });
};

const updateBattles = async (req, res) => {
  const { battles, error } = await handleUpdateBattles(req);
  if (error) return render.custom(res, error.status, error.message);

  return render.success(res, { battles });
};

const getBattles = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.query, validators.battle.getBattlesSchema);
  if (validationError) return render.error(res, validationError);

  const { battles, hasMore, error } = await getBattlesData(params);
  if (error) return render.custom(res, error.status, error.message);

  return render.success(res, { battles, hasMore });
};

const cancelBattle = async (req, res) => {
  const { params, validationError } = validators
    .validate(req.body, validators.battle.cancelBattleSchema);
  if (validationError) return render.error(res, validationError);

  const { battle, error } = await handleCancelBattle(params);
  if (error) return render.custom(res, error.status, error.message);

  return render.success(res, battle);
};

module.exports = {
  createBattle,
  connectBattle,
  getCryptoCurrencies,
  getTopWarriors,
  updateBattles,
  getBattles,
  cancelBattle,
};
