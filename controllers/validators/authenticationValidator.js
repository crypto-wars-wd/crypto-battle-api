const Joi = require('@hapi/joi');

const options = { allowUnknown: true, stripUnknown: true };

exports.hasSocialShcema = Joi.object().keys({
  provider: Joi.string().required(),
  id: Joi.string().required(),
}).options(options);

exports.socialAuthShcema = Joi.object().keys({
  avatar: Joi.string().pattern(new RegExp('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$')).allow('').default(''),
  alias: Joi.string().allow(''),
}).unknown(true);
