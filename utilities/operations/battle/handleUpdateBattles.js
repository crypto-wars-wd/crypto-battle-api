const { battleModel, cryptoModel, userModel } = require('models');
const _ = require('lodash');
const { hiveHelper } = require('utilities/helpers');

module.exports = async (req) => {
  await Promise.all(req.body.stepsCollection.map(async (collection) => {
    const updateData = { $push: { steps: collection.step } };
    await battleModel.updateOne({ condition: { _id: collection.id }, updateData });
  }));

  if (req.body.endedBattles && req.body.endedBattles.length) {
    await endBattle(req);
    await sendFundsToWinners(req);
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
  const win = { $inc: { numberOfLosses: 0, numberOfVictories: 1, numberOfFights: 1 } };
  const lose = { $inc: { numberOfLosses: 1, numberOfVictories: 0, numberOfFights: 1 } };

  await Promise.all(req.body.endedBattles.map(async (battle) => {
    const updateData = {
      gameStatus: 'END',
      'winner.playerID': battle.playerWin,
      'winner.cryptoName': battle.cryptoWin,
      'loser.playerID': battle.playerLose,
      'loser.cryptoName': battle.cryptoLose,
    };
    await battleModel.updateOne({ condition: { _id: battle.battleID }, updateData });
  }));
  await Promise.all(cryptoWin.map(async (cryptoName) => {
    await cryptoModel.updateOne({ condition: { cryptoName }, updateData: win });
  }));
  await Promise.all(cryptoLose.map(async (cryptoName) => {
    await cryptoModel.updateOne({ condition: { cryptoName }, updateData: lose });
  }));
  await Promise.all(warriorsWin.map(async (_id) => {
    await userModel.updateOne({ condition: { _id }, updateData: win });
  }));
  await Promise.all(warriorsLose.map(async (_id) => {
    await userModel.updateOne({ condition: { _id }, updateData: lose });
  }));
};

const sendFundsToWinners = async (req) => {
  const battleID = _.map(req.body.endedBattles, 'battleID');
  const { battles } = await battleModel.endedBattlesWithBet({ battles: battleID });
  if (!battles) return;
  await Promise.all(battles.map(async (element) => {
    const amount = element.bet.possibleWin.split(' ')[0];
    const cryptoType = element.bet.possibleWin.split(' ')[1];
    if (!await hiveHelper.checkBankBalance({ amount, cryptoType })) {
      return console.error('Not enough funds to pay');
    }
    await hiveHelper.transfer({
      from: process.env.HIVE_ACCOUNT_NAME || '',
      to: element.winner.cryptoName === element.firstPlayer.cryptoName
        ? element.firstPlayer.userInfo.personalAccount.hiveName
        : element.secondPlayer.userInfo.personalAccount.hiveName,
      amount,
      activeKey: process.env.HIVE_ACTIVE_KEY || '',
      cryptoType,
    });
  }));
};
