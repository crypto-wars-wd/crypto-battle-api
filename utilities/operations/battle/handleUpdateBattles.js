const { battleModel, cryptoModel, userModel } = require('models');

module.exports = async (req) => {
  const { battles: update, error: updateManyError } = await battleModel.updateMany(req.body);
  if (updateManyError) return { error: { status: 503, message: updateManyError.message } };

  if (req.body.endedBattles && req.body.endedBattles.length) {
    await endBattle(req);
  }
  const { battles, error: findManyError } = await battleModel.findMany(req.body);
  if (findManyError) return { error: { status: 503, message: findManyError.message } };

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
