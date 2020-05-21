const { POPULATE_PATH_PLAYER1 } = require('utilities/constants');
const { battleModel } = require('models');
const render = require('concerns/render');

exports.battleWithPlayer1 = async (req, res, params) => {
  const { newBattle, createBattleError } = await battleModel.createNewBattle(params);
  if (createBattleError) return render.error(res, createBattleError);
  const { battleWithPlayer, populateError } = await battleModel
    .populateBattle({ _id: newBattle._id, path: POPULATE_PATH_PLAYER1 });
  if (populateError) return render.error(res, populateError);
  return battleWithPlayer;
};
