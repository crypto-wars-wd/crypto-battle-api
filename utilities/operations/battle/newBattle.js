const { POPULATE_PATH_PLAYER1 } = require('utilities/constants');
const { battleModel } = require('models');
const { withdrawHelper } = require('utilities/helpers');

module.exports = async (req, res, params) => {
  if (params.betType) {
    const { user, error } = await withdrawHelper.withdrawBet(params);
    if (user.n === 0 || user.nModified === 0) return { error: { status: 404, message: 'User not found' } };
    if (error) return { error: { status: 503, message: error.message } };
  }
  const possibleWin = params.betType ? `${((params.amount * 2) * 90) / 100} ${params.betType}` : undefined;
  const { newBattle, error: createBattleError } = await battleModel.createNewBattle({
    cryptoName: params.cryptoName,
    playerID: params.playerID,
    healthPoints: params.healthPoints,
    betType: params.betType,
    amount: params.amount,
    possibleWin,
  });
  if (createBattleError) return { error: { status: 503, message: createBattleError.message } };

  const { battle, error: populateError } = await battleModel
    .populateBattle({ _id: newBattle._id, path: POPULATE_PATH_PLAYER1 });
  if (populateError) return { error: { status: 503, message: populateError.message } };
  if (!battle) return { error: { status: 404, message: 'Battle not found' } };

  return { battle };
};
