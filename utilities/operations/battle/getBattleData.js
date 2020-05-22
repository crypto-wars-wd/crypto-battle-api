const { userModel } = require('models');

module.exports = async (req, res, params) => {
  const { warriors, error: findWarriorsError } = await userModel
    .findTopWarriors({ limit: params.limit + 1, skip: params.skip });
  if (findWarriorsError) return { findWarriorsError };

  return {
    warriors: warriors.slice(0, params.limit),
    hasMore: warriors.length > params.limit,
  };
};
