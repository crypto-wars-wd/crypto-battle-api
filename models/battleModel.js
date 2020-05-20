const { Battle } = require('database').models;

const createNewBattle = async ({
  cryptoName, playerID, healthPoints, alias, avatar,
}) => {
  console.log( alias)
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

module.exports = {
  createNewBattle,
};
