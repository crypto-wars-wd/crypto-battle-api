const { faker, Battle } = require('test/testHelper');

const createNewBattle = async ({
  cryptoName, playerID, healthPoints, onlyData,
} = {}) => {
  const battleData = {
    'firstPlayer.cryptoName': cryptoName || `${faker.name.firstName()}`,
    'firstPlayer.playerID': playerID || `${faker.name.firstName()}${faker.random.number()}`,
    healthPoints: healthPoints || `${faker.random.number()}`,
  };
  if (onlyData) return battleData;
  const battle = new Battle(battleData);

  await battle.save();
  battle.toObject();
  return battle;
};

module.exports = { createNewBattle };
