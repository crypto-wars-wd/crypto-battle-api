const { Battle } = require('database').models;

const createNewBattle = async ({
  cryptoName, playerID, healthPoints, alias, avatar,
}) => {
  console.log(alias);
  const battle = new Battle({
    'playersInfo.firstPlayer.cryptoName': cryptoName,
    'playersInfo.firstPlayer.playerID': playerID,
    'playersInfo.firstPlayer.avatar': avatar,
    'playersInfo.firstPlayer.alias': alias,
    'playersInfo.healthPoints': healthPoints,
  });
  try {
    await battle.save();
  } catch (err) {
    return { message: err };
  }
  return { battle: battle.toObject() };
};

const connectBattle = async ({
  cryptoName, playerID, battleID, alias, avatar,
}) => {
  try {
    return {
      battle: await Battle.findOneAndUpdate({ _id: battleID }, {
        'playersInfo.secondPlayer.cryptoName': cryptoName,
        'playersInfo.secondPlayer.playerID': playerID,
        'playersInfo.secondPlayer.avatar': avatar,
        'playersInfo.secondPlayer.alias': alias,
        gameStatus: 'START',
      }, { new: true }).lean(),
    };
  } catch (err) {
    return { message: err };
  }
};

const updateStatsBattle = async ({
  _id, playersInfo, ...rest
}) => {
  try {
    return {
      battle: await Battle.findOneAndUpdate({ _id, playersInfo }, rest, { new: true }).lean(),
    };
  } catch (err) {
    return { message: err };
  }
};

const getBattlesByState = async ({ gameStatus }) => {
  try {
    return {
      battles: await Battle.find({ gameStatus }).lean(),
    };
  } catch (err) {
    return { message: err };
  }
};

module.exports = {
  createNewBattle, connectBattle, updateStatsBattle, getBattlesByState,
};
