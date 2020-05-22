const { userModel } = require('models');

module.exports = async (req, res, params) => {
  const { warriors, error: findWarriorsError } = await userModel
    .findTopWarriors({ limit: params.limit + 1, skip: params.skip });
  if (findWarriorsError) return { error: { status: 404, message: 'Warriors not found' } };

  return {
    warriors: warriors.slice(0, params.limit),
    hasMore: warriors.length > params.limit,
  };
};
