const Joi = require('@hapi/joi');

const options = { allowUnknown: true, stripUnknown: true };

exports.createBattleShcema = Joi.object().keys({
  cryptoName: Joi.string().required(),
  playerID: Joi.string().required(),
  healthPoints: Joi.number().required(),
}).options(options);

exports.connectBattleShcema = Joi.object().keys({
  cryptoName: Joi.string().required(),
  playerID: Joi.string().required(),
  battleID: Joi.string().required(),
}).options(options);
