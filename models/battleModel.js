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
  } catch (error) {
    return { error };
  }
  return { newBattle: battle.toObject() };
};
const populateBattle = async ({ _id, path }) => {
  try {
    return { battle: await Battle.findOne({ _id }).populate({ path }).lean() };
  } catch (error) {
    return { error };
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
      }, { new: true })
        .populate([{ path: POPULATE_PATH_PLAYER1 }, { path: POPULATE_PATH_PLAYER2 }]).lean(),
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
    let pipeline;
    switch (playerID) {
      case 'all':
        pipeline = { gameStatus };
        break;
      case undefined:
        pipeline = { gameStatus };
        break;
      default:
        pipeline = {
          $or: [{ gameStatus, 'firstPlayer.playerID': playerID },
            { gameStatus, 'secondPlayer.playerID': playerID }],
        };
        break;
    }
    return {
      battles: await Battle.find(pipeline).populate([{ path: POPULATE_PATH_PLAYER1 }, { path: POPULATE_PATH_PLAYER2 }]).lean(),
    };
  } catch (error) {
    return { error };
  }
};

const updateOne = async ({ battleID, updData }) => {
  try {
    const battle = await Battle.findOneAndUpdate({ _id: battleID }, updData)
      .populate([{ path: POPULATE_PATH_PLAYER1 }, { path: POPULATE_PATH_PLAYER2 }]).lean();
    return { battle: !!battle.nModified };
  } catch (error) {
    return { error };
  }
};

const updateMany = async ({ battles, steps }) => {
  try {
    return { battles: await Battle.updateMany({ _id: { $in: battles } }, { $push: { steps } }).lean() };
  } catch (error) {
    return { error };
  }
};

module.exports = {
  createNewBattle, connectBattle, updateStatsBattle, getBattlesByState, populateBattle, updateOne, updateMany,
};
