const { faker, models } = require('test/testHelper');

const createNewBattle = async ({
  cryptoName, playerID, healthPoints,
} = {}) => {
  const battleData = {
    'playersInfo.firstPlayer.cryptoName': cryptoName || `${faker.name.firstName()}`,
    'playersInfo.firstPlayer.playerID': playerID || `${faker.name.firstName()}${faker.random.number()}`,
    'playersInfo.healthPoints': healthPoints || `${faker.random.number()}`,
  };

  const battle = new models.Battle(battleData);

  await battle.save();
  return battle;
};

module.exports = { createNewBattle };
