const {
  expect, dropDatabase, battleModel, assert, models,
} = require('test/testHelper');
const { BattleFactory } = require('test/factories');

describe('battleModel', async () => {
  describe('createNewBattle', async () => {
    let battleData, mockData;

    beforeEach(async () => {
      await dropDatabase();
      battleData = await BattleFactory.createNewBattle({ cryptoName: 'BTC', onlyData: true });
      mockData = {
        cryptoName: battleData['playersInfo.firstPlayer.cryptoName'],
        playerID: battleData['playersInfo.firstPlayer.playerID'],
        healthPoints: battleData['playersInfo.healthPoints'],
        alias: battleData['playersInfo.firstPlayer.alias'],
        avatar: battleData['playersInfo.firstPlayer.avatar'],
      };
    });
    it('should save new battle to db', async () => {
      const actual = await battleModel.createNewBattle(mockData);
      assert(!actual.isNew); // if actual is saved to db it is not new
    });
    it('should find battle', async () => {
      await battleModel.createNewBattle(mockData);
      const battle = await models.Battle.findOne({ 'playersInfo.firstPlayer.playerID': mockData.playerID });
      expect(battle.playersInfo.firstPlayer.cryptoName).to.be.eq('BTC');
    });
    it('should be error message', async () => {
      const { message } = await battleModel.createNewBattle({ lkkdfs: 'dfsdf' });
      expect(message).to.be.exist;
    });
  });
});
