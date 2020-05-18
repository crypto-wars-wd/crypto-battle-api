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

exports.statsBattleShcema = Joi.object().keys({
  _id: Joi.string().required(),
  playersInfo: Joi.object().keys({
    firstPlayer: Joi.object().keys({
      cryptoName: Joi.string().required(),
      playerID: Joi.string().required(),
    }),
    secondPlayer: Joi.object().keys({
      cryptoName: Joi.string().required(),
      playerID: Joi.string().required(),
    }),
    healthPoints: Joi.number().required(),
  }).required(),
  gameStatus: Joi.string().valid('START', 'END').required(),
  steps: Joi.array().items(Joi.object().keys({
    playersStats: Joi.array().items(Joi.object().keys({
      widgetName: Joi.string().required(),
      status: Joi.string().required(),
      price: Joi.number().required().unsafe(),
      playerID: Joi.string().required(),
      healthPoints: Joi.number().required(),
    })),
    messages: Joi.string(),
  })),
  winner: Joi.when('gameStatus', {
    is: 'END',
    then: Joi.object().keys({
      playerID: Joi.string().required(),
      cryptoName: Joi.string().required(),
    }),
  }),
  looser: Joi.when('gameStatus', {
    is: 'END',
    then: Joi.object().keys({
      playerID: Joi.string().required(),
      cryptoName: Joi.string().required(),
    }),
  }),
}).options(options);
