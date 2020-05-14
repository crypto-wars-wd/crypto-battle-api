const { Battle } = require('database').models;

const createNewBattle = async ({
  cryptoName, playerId, healthPoints,
}) => {
  const battle = new Battle({
    warriors: [cryptoName],
    'playersInfo.cryptoNames': [cryptoName],
    'playersInfo.playersId': [playerId],
    'playersInfo.healthPoints': healthPoints,
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