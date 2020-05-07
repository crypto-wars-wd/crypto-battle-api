const Joi = require('@hapi/joi');

const options = { allowUnknown: true, stripUnknown: true };

exports.hasSocialShcema = Joi.object().keys({
  provider: Joi.string().required(),
  id: Joi.string().required(),
}).options(options);

exports.socialAuthShcema = Joi.object().keys({
  userName: Joi.string(),
  avatar: Joi.string().pattern(new RegExp('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$')).allow('').default(''),
  alias: Joi.string().allow(''),
  allowEmail: Joi.boolean().default(false),
}).unknown(true);

exports.createUserSchema = Joi.object().keys({
  userName: Joi.string(),
  avatar: Joi.string().pattern(new RegExp('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$')).allow(null).default(''),
  alias: Joi.string().allow(''),
  email: Joi.string().allow(null).default(null),
  id: Joi.string().required(),
  provider: Joi.string().required(),
  session: Joi.object().keys({
    sid: Joi.string().required(),
    secret_token: Joi.string().required(),
  }),
});
