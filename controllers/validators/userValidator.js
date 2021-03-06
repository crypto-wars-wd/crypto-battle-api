const Joi = require('@hapi/joi');

const options = { allowUnknown: true, stripUnknown: true };

exports.updateInfoSchema = Joi.object().keys({
  avatar: Joi.string().required(),
  alias: Joi.string().required(),
  id: Joi.string().required(),
}).options(options);

exports.linkToHiveSchema = Joi.object().keys({
  userID: Joi.string().required(),
  hiveName: Joi.string().required(),
}).options(options);

exports.getAccountSchema = Joi.object().keys({
  userID: Joi.string().required(),
}).options(options);
