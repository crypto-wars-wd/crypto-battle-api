const { cryptoModel } = require('models');

module.exports = async (req, res, params) => {
  const { crypto, error: findWarriorsError } = await cryptoModel
    .findAllCrypto({ limit: params.limit + 1, skip: params.skip });
  if (findWarriorsError) return { error: { status: 503, message: findWarriorsError.message } };

  return {
    crypto: crypto.slice(0, params.limit),
    hasMore: crypto.length > params.limit,
  };
};
