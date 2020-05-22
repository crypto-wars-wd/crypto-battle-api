const {
  expect, dropDatabase, battleModel, Battle, ObjectID, faker,
} = require('test/testHelper');
const { BattleFactory, UserFactory } = require('test/factories');

describe('battleModel', async () => {
  describe('createNewBattle', async () => {
    let battleData, mockData, auth, user;

    beforeEach(async () => {
      await dropDatabase();
      auth = {
        id: new ObjectID(),
        provider: faker.name.firstName(),
      };
      user = await UserFactory.createUser({ numberOfVictories: faker.random.number(), auth });
      battleData = await BattleFactory.createNewBattle({ cryptoName: 'BTC', onlyData: true });
      mockData = {
        cryptoName: battleData['firstPlayer.cryptoName'],
        playerID: user._id,
        healthPoints: battleData.healthPoints,
      };
    });
    it('should save new battle to db', async () => {
      const actual = await battleModel.createNewBattle(mockData);
      expect(!actual.isNew).to.be.true; // if actual is saved to db it is not new
    });
    it('should find battle', async () => {
      const { newBattle } = await battleModel.createNewBattle(mockData);
      const battle = await Battle.findOne({ _id: newBattle._id });
      expect(battle).to.be.exist;
    });
    it('should be error message', async () => {
      const { error } = await battleModel.createNewBattle({ lkkdfs: 'dfsdf' });
      expect(error).to.be.exist;
    });
  });
});
