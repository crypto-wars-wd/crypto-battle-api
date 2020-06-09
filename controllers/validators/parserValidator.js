const Joi = require('@hapi/joi');

const options = { allowUnknown: true, stripUnknown: true };

exports.updateBalanceSchema = Joi.object().keys({
  senderName: Joi.string().required(),
  amount: Joi.number().required(),
  cryptoType: Joi.string().valid('HIVE', 'HBD').required(),
  memo: Joi.string(),
}).options(options);
