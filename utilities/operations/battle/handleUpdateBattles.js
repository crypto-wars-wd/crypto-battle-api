const { battleModel, cryptoModel, userModel } = require('models');
const _ = require('lodash');

module.exports = async (req) => {
  const updateManyError = await battleModel.updateBattles(req.body);
  if (updateManyError) return { error: { status: 503, message: updateManyError.message } };

  if (req.body.endedBattles && req.body.endedBattles.length) {
    await endBattle(req);
  }
  const { battles, error: findManyError } = await battleModel.findMany(req.body);
  if (findManyError) return { error: { status: 503, message: findManyError.message } };

  return { battles };
};

const endBattle = async (req) => {
  const cryptoWin = _.map(req.body.endedBattles, 'cryptoWin');
  const cryptoLose = _.map(req.body.endedBattles, 'cryptoLose');
  const warriorsWin = _.map(req.body.endedBattles, 'playerWin');
  const warriorsLose = _.map(req.body.endedBattles, 'playerLose');

  await battleModel.endBattles(req.body);
  await cryptoModel.updateCryptoResultBattle({ cryptoName: cryptoWin, resultBattle: 'win' });
  await cryptoModel.updateCryptoResultBattle({ cryptoName: cryptoLose, resultBattle: 'lose' });
  await userModel.updateUserResultBattle({ playerID: warriorsWin, resultBattle: 'win' });
  await userModel.updateUserResultBattle({ playerID: warriorsLose, resultBattle: 'lose' });
};
