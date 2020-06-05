module.exports = {
  authentication: require('./authenticationValidator'),
  battle: require('./battleValidator'),
  user: require('./userValidator'),
  keyValidator: require('./keyValidator'),
  parserValidator: require('./parserValidator'),
  validate: (data, schema) => {
    const result = schema.validate(data, { abortEarly: false });

    if (result.error) return { validationError: result.error };

    return { params: result.value };
  },
};
