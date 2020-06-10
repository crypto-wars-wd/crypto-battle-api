const { battleModel } = require('models');
const { POPULATE_PATH_PLAYER1 } = require('utilities/constants');
const { hiveHelper } = require('utilities/helpers');

module.exports = async (params) => {
  const { battle, error } = await battleModel.populateBattle({
    _id: params.battleID,
    path: POPULATE_PATH_PLAYER1,
    select: '+personalAccount',
  });
  if (error) return { error: { status: 503, message: error.message } };
  if (battle.gameStatus !== 'WAITING') {
    return { error: { status: 403, message: 'Forbidden: battle already start or ended' } };
  }
  if (battle && battle.bet) {
    const { result, error: transferError } = await transferBack(battle);
    if (transferError) return { error: { status: 503, message: transferError.message } };
    console.log(result);
  }
  const { battle: deletedBattle } = await battleModel.deleteOne({
    condition: { _id: params.battleID },
  });

  return { battle: deletedBattle };
};

const transferBack = async (battle) => {
  if (!await hiveHelper.checkBankBalance({
    amount: battle.bet.amount,
    cryptoType: battle.bet.betType,
  })) {
    return { error: { message: 'Not enough funds to pay' } };
  }

  const { result, error } = await hiveHelper.transfer({
    from: process.env.HIVE_ACCOUNT_NAME || '',
    to: battle.firstPlayer.userInfo.personalAccount.hiveName,
    amount: battle.bet.amount,
    activeKey: process.env.HIVE_ACTIVE_KEY || '',
    cryptoType: battle.bet.betType,
  });
  if (error) return { error };

  return { result };
};
