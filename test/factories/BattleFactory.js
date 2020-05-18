const { faker, Battle } = require('test/testHelper');

const createNewBattle = async ({
  cryptoName, playerID, healthPoints,
} = {}) => {
  const battleData = {
    'playersInfo.firstPlayer.cryptoName': cryptoName || `${faker.name.firstName()}`,
    'playersInfo.firstPlayer.playerID': playerID || `${faker.name.firstName()}${faker.random.number()}`,
    'playersInfo.healthPoints': healthPoints || `${faker.random.number()}`,
  };

  const battle = new Battle(battleData);

  await battle.save();
  battle.toObject();
  return { battle };
};

module.exports = { createNewBattle };
