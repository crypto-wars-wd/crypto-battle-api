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
  const win = { numberOfLosses: 0, numberOfVictories: 1, numberOfFights: 1 };
  const lose = { numberOfLosses: 1, numberOfVictories: 0, numberOfFights: 1 };

  await battleModel.endBattles(req.body);
  await Promise.all(cryptoWin.map(async (cryptoName) => {
    await cryptoModel.updateCryptoResultBattle({ cryptoName, resultBattle: win });
  }));
  await Promise.all(cryptoLose.map(async (cryptoName) => {
    await cryptoModel.updateCryptoResultBattle({ cryptoName, resultBattle: lose });
  }));
  await Promise.all(warriorsWin.map(async (_id) => {
    await userModel.updateUserResultBattle({ _id, resultBattle: win });
  }));
  await Promise.all(warriorsLose.map(async (_id) => {
    await userModel.updateUserResultBattle({ _id, resultBattle: lose });
  }));
};
