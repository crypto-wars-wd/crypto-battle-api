const { POPULATE_PATH_PLAYER1 } = require('utilities/constants');
const { battleModel } = require('models');

module.exports = async (req, res, params) => {
  const { newBattle, error: createBattleError } = await battleModel.createNewBattle(params);
  if (createBattleError) return { createBattleError };

  const { battleWithPlayer, error: populateError } = await battleModel
    .populateBattle({ _id: newBattle._id, path: POPULATE_PATH_PLAYER1 });
  if (populateError) return { populateError };

  return { battleWithPlayer };
};
