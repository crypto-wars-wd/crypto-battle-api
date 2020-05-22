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
  } catch (error) {
    return { error };
  }
  return { newBattle: battle.toObject() };
};
const populateBattle = async ({ id, path }) => {
  try {
    return { battleWithPlayer: await Battle.findOne({ id }).populate({ path }).lean() };
  } catch (error) {
    return { error };
  }
};

module.exports = {
  createNewBattle,
  populateBattle,
};
