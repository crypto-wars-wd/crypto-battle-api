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
  } catch (err) {
    return { message: err };
  }
  return { battle: battle.toObject() };
};

module.exports = {
  createNewBattle,
};
