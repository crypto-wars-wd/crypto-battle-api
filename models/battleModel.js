const { Battle } = require('database').models;
const { POPULATE_PATH_PLAYER1, POPULATE_PATH_PLAYER2 } = require('utilities/constants');

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
  cryptoName, playerID, battleID,
}) => {
  try {
    return {
      battle: await Battle.findOneAndUpdate({ _id: battleID }, {
        'secondPlayer.cryptoName': cryptoName,
        'secondPlayer.playerID': playerID,
        gameStatus: 'START',
      }, { new: true }).populate([{ path: POPULATE_PATH_PLAYER1 }, { path: POPULATE_PATH_PLAYER2 }]).lean(),
    };
  } catch (error) {
    return { error };
  }
};

const updateStatsBattle = async ({
  _id, ...rest
}) => {
  try {
    return {
      battle: await Battle.findOneAndUpdate({ _id }, rest, { new: true })
        .populate([{ path: POPULATE_PATH_PLAYER1 }, { path: POPULATE_PATH_PLAYER2 }]).lean(),
    };
  } catch (error) {
    return { error };
  }
};

const getBattlesByState = async ({ gameStatus, playerID }) => {
  try {
    let options;
    switch (playerID) {
      case 'all':
        options = { gameStatus };
        break;
      default:
        options = {
          $or: [{ gameStatus, 'firstPlayer.playerID': playerID },
            { gameStatus, 'secondPlayer.playerID': playerID }],
        };
        break;
    }
    return {
      battles: await Battle.find(options).populate([{ path: POPULATE_PATH_PLAYER1 }, { path: POPULATE_PATH_PLAYER2 }]).lean(),
    };
  } catch (error) {
    return { error };
  }
};

module.exports = {
  createNewBattle, connectBattle, updateStatsBattle, getBattlesByState, populateBattle,
};
