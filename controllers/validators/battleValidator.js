const Joi = require('@hapi/joi');

const options = { allowUnknown: true, stripUnknown: true };

exports.createBattleShcema = Joi.object().keys({
  cryptoName: Joi.string().required(),
  playerId: Joi.string().required(),
  healthPoints: Joi.number().required(),
}).options(options);
