const Joi = require('@hapi/joi');

const options = { allowUnknown: true, stripUnknown: true };

exports.createBattleSchema = Joi.object().keys({
  cryptoName: Joi.string().required(),
  playerID: Joi.string().required(),
  healthPoints: Joi.number().required(),
}).options(options);

exports.topWarriorsSchema = Joi.object().keys({
  limit: Joi.number().default(10),
  skip: Joi.number().default(0),
}).options(options);
