const { battleModel, cryptoModel, userModel } = require('models');

module.exports = async (req, res, params) => {
  const { battles: update, error } = await battleModel.updateMany(req.body);

  if (req.body.endedBattles && req.body.endedBattles.length) {
    await endBattle(req);
  }
  const { battles, error: newError } = await battleModel.findMany(req.body);

  return { battles };
};

const endBattle = async (req) => {
  const cryptoWin = req.body.endedBattles.map((item) => item.cryptoWin);
  const cryptoLose = req.body.endedBattles.map((item) => item.cryptoLose);
  const warriorsWin = req.body.endedBattles.map((item) => item.playerWin);
  const warriorsLose = req.body.endedBattles.map((item) => item.playerLose);

  await battleModel.endBattles(req.body);
  await cryptoModel.updateCryptoResultBattle({ cryptoName: cryptoWin, resultBattle: 'win' });
  await cryptoModel.updateCryptoResultBattle({ cryptoName: cryptoLose, resultBattle: 'lose' });
  await userModel.updateUserResultBattle({ playerID: warriorsWin, resultBattle: 'win' });
  await userModel.updateUserResultBattle({ playerID: warriorsLose, resultBattle: 'lose' });
};
