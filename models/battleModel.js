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

const findMany = async ({ battles }) => {
  try {
    return { battles: await Battle.find({ _id: { $in: battles } }).lean() };
  } catch (error) {
    return { error };
  }
};

const updateOneByID = async ({ _id, dataToUpdate }) => {
  try {
    await Battle.updateOne({ _id }, dataToUpdate);
  } catch (error) {
    return { error };
  }
};

const getBattlesData = async ({
  pipeline, limit, skip, updatedAt,
}) => {
  try {
    return {
      battles: await Battle.find(pipeline).sort({ updatedAt }).skip(skip).limit(limit)
        .lean(),
    };
  } catch (error) {
    return { error };
  }
};

module.exports = {
  createNewBattle,
  connectBattle,
  populateBattle,
  findMany,
  updateOneByID,
  getBattlesData,
};
