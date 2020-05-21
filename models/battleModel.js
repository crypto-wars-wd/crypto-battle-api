const { Battle } = require('database').models;

const createNewBattle = async ({
  cryptoName, playerID, healthPoints, alias, avatar,
}) => {
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
  _id, ...rest
}) => {
  try {
    return {
      battle: await Battle.findOneAndUpdate({ _id }, rest, { new: true }).lean(),
    };
  } catch (err) {
    return { message: err };
  }
};

const getBattlesByState = async ({ gameStatus, playerID }) => {
  try {
    if (playerID === 'all') playerID = /^/;
    return {
      battles: await Battle.find({
        $or: [{ gameStatus, 'playersInfo.firstPlayer.playerID': playerID },
          { gameStatus, 'playersInfo.secondPlayer.playerID': playerID }],
      }).lean(),
    };
  } catch (err) {
    return { message: err };
  }
};

module.exports = {
  createNewBattle, connectBattle, updateStatsBattle, getBattlesByState,
};
