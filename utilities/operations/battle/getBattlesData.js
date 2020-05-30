const { battleModel } = require('models');

module.exports = async (params) => {
  const gameStatus = params.state === 'all' ? /^/ : params.state.toUpperCase();
  const playerID = params.id;
  let pipeline;

  switch (playerID) {
    case undefined:
      pipeline = { gameStatus };
      break;
    default:
      pipeline = {
        $or: [{ gameStatus, 'firstPlayer.playerID': playerID },
          { gameStatus, 'secondPlayer.playerID': playerID }],
      };
      break;
  }

  const { battles, error: findBattlesError } = await battleModel
    .getBattlesData({
      limit: params.limit + 1,
      skip: params.skip,
      updatedAt: params.sort,
      pipeline,
    });
  if (findBattlesError) return { error: { status: 503, message: findBattlesError.message } };

  return {
    battles: battles.slice(0, params.limit),
    hasMore: battles.length > params.limit,
  };
};
