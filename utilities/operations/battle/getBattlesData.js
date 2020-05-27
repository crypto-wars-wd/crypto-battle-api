const { battleModel } = require('models');

module.exports = async (params) => {
  const { battles, error: findBattlesError } = await battleModel
    .getBattlesData(
      {
        gameStatus: params.state ? params.state.toUpperCase() : /^/,
        limit: params.limit + 1,
        skip: params.skip,
        updatedAt: params.sort,
        playerID: params.id,
      },
    );
  if (findBattlesError) return { error: { status: 503, message: findBattlesError.message } };

  return {
    battles: battles.slice(0, params.limit),
    hasMore: battles.length > params.limit,
  };
};
