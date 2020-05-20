const { POPULATE_PATH_PLAYER1 } = require('utilities/constants');
const { battleModel } = require('models');
const render = require('concerns/render');

exports.battleWithPlayer1 = async (req, res, params) => {
  let { battle, error } = await battleModel.createNewBattle(params);
  if (error) return render.error(res, error);
  ({ battle, error } = await battleModel
    .populateBattle({ _id: battle._id, path: POPULATE_PATH_PLAYER1 }));
  if (error) return render.error(res, error);
  return battle;
};
