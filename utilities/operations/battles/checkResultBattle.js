const _ = require('lodash');
const { cryptoModel, userModel } = require('models');

module.exports = async (battle) => {
  const { message: cryptoLooser } = await cryptoModel.updateCryptoResultBattle({ cryptoName: battle.looser.cryptoName, resultBattle: 'lose' });
  const { message: cryptoWinner } = await cryptoModel.updateCryptoResultBattle({ cryptoName: battle.winner.cryptoName, resultBattle: 'win' });
  const { message: userLooser } = await userModel.updateUserResultBattle({ playerID: battle.looser.playerID, resultBattle: 'lose' });
  const { message: userWinner } = await userModel.updateUserResultBattle({ playerID: battle.winner.playerID, resultBattle: 'win' });
  if (_.isNil(cryptoLooser) || _.isNil(cryptoWinner) || _.isNil(userLooser) || _.isNil(userWinner)) {
    return { error: 'error dataBase one of the result battles' };
  }
  return { result: true };
};
