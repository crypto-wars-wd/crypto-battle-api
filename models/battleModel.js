const { Battle } = require('database').models;

const createNewBattle = async ({
  cryptoName, playerID, healthPoints,
}) => {
  const battle = new Battle({
    'firstPlayer.cryptoName': cryptoName,
    'firstPlayer.playerID': playerID,
    healthPoints,
  });
  try {
    await battle.save();
  } catch (createBattleError) {
    return { createBattleError };
  }
  return { newBattle: battle.toObject() };
};
const populateBattle = async ({ id, path }) => {
  try {
    return { battleWithPlayer: await Battle.findOne({ id }).populate({ path }).lean() };
  } catch (populateError) {
    return { populateError };
  }
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
  createNewBattle, connectBattle, updateStatsBattle, getBattlesByState, populateBattle,
};
