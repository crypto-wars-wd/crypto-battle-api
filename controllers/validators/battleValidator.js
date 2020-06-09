const Joi = require('@hapi/joi');

const options = { allowUnknown: true, stripUnknown: true };

exports.createBattleSchema = Joi.object().keys({
  cryptoName: Joi.string().required(),
  playerID: Joi.string().required(),
  healthPoints: Joi.number().required(),
  betType: Joi.string().valid('HIVE', 'HBD'),
  amount: Joi.number(),
}).options(options);

exports.topWarriorsSchema = Joi.object().keys({
  limit: Joi.number().default(10),
  skip: Joi.number().default(0),
}).options(options);

exports.topCryptoSchema = Joi.object().keys({
  limit: Joi.number().default(10),
  skip: Joi.number().default(0),
}).options(options);

exports.connectBattleShcema = Joi.object().keys({
  cryptoName: Joi.string().required(),
  playerID: Joi.string().required(),
  battleID: Joi.string().required(),
  message: Joi.string().required(),
  betType: Joi.string().valid('HIVE', 'HBD'),
  amount: Joi.number(),
}).options(options);

exports.getBattlesSchema = Joi.object().keys({
  state: Joi.string().valid('waiting', 'start', 'end', 'all').default('all'),
  limit: Joi.number().default(10),
  skip: Joi.number().default(0),
  sort: Joi.string().valid('asc', 'desc').default('desc'),
  id: Joi.string(),
}).options(options);
