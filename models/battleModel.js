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

// my
const updateMany = async ({ battles, steps }) => {
  try {
    return {
      battles: await Battle.updateMany({ _id: { $in: battles } }, { $push: { steps } })
        .lean(),
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
const endBattles = async ({ endedBattles }) => {
  try {
    await Promise.all(endedBattles.map(async (battle) => {
      await Battle.updateOne({ _id: battle.battleID },
        {
          gameStatus: 'END',
          'winner.playerID': battle.playerWin,
          'winner.cryptoName': battle.cryptoWin,
          'loser.playerID': battle.playerLose,
          'loser.cryptoName': battle.cryptoLose,
        });
    }));
  } catch (error) {
    return { error };
  }
};

module.exports = {
  createNewBattle,
  connectBattle,
  getBattlesByState,
  populateBattle,
  updateMany,
  findMany,
  endBattles,
};
