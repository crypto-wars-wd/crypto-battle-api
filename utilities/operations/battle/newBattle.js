const { POPULATE_PATH_PLAYER1 } = require('utilities/constants');
const { battleModel, userModel } = require('models');

module.exports = async (req, res, params) => {
  if (params.betType) {
    const { user, error } = await userModel.updateOne({
      condition: { _id: params.playerID },
      updateData: { $inc: { [`personalAccount.${params.betType}`]: -params.amount } },
    });
    if (user.n === 0 || user.nModified === 0) return { error: { status: 404, message: 'User not found' } };
    if (error) return { error: { status: 503, message: error.message } };
  }
  const { newBattle, error: createBattleError } = await battleModel.createNewBattle(params);
  if (createBattleError) return { error: { status: 503, message: createBattleError.message } };

  const { battle, error: populateError } = await battleModel
    .populateBattle({ _id: newBattle._id, path: POPULATE_PATH_PLAYER1 });
  if (populateError) return { error: { status: 503, message: populateError.message } };
  if (!battle) return { error: { status: 404, message: 'Battle not found' } };

  return { battle };
};
