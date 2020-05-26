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

exports.topCryptoSchema = Joi.object().keys({
  limit: Joi.number().default(10),
  skip: Joi.number().default(0),
}).options(options);

exports.connectBattleShcema = Joi.object().keys({
  cryptoName: Joi.string().required(),
  playerID: Joi.string().required(),
  battleID: Joi.string().required(),
}).options(options);

exports.statsBattleShcema = Joi.array().items(Joi.object().keys({
  _id: Joi.string().required(),
  firstPlayer: Joi.object().keys({
    cryptoName: Joi.string().required(),
    playerID: Joi.string().required(),
  }),
  secondPlayer: Joi.object().keys({
    cryptoName: Joi.string().required(),
    playerID: Joi.string().required(),
  }),
  healthPoints: Joi.number().required(),
  gameStatus: Joi.string().valid('START', 'END').required(),
  steps: Joi.array().items(Joi.object().keys({
    playersStats: Joi.array().items(Joi.object().keys({
      cryptoName: Joi.string().required(),
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
}).options(options));

exports.showBattlesByState = Joi.object().keys({
  state: Joi.string().valid('all', 'waiting', 'start', 'end').required(),
  playerID: Joi.string(),
}).options(options);
