const {
  expect, dropDatabase, battleModel, assert, models,
} = require('test/testHelper');
const { BattleFactory } = require('test/factories');

describe('battleModel', async () => {
  describe('createNewBattle', async () => {
    let battleData;

    beforeEach(async () => {
      await dropDatabase();
      battleData = await BattleFactory.createNewBattle({ cryptoName: 'BTC' });
    });
    it('should save new battle to db', async () => {
      const actual = await battleModel.createNewBattle(battleData);
      assert(!actual.isNew); // if actual is saved to db it is not new
    });
    it('should find battle', async () => {
      await battleModel.createNewBattle(battleData);
      const battle = await models.Battle.findOne({ 'playersInfo.firstPlayer.cryptoName': 'BTC' });
      expect(battle.playersInfo.firstPlayer.cryptoName).to.be.eq('BTC');
    });
    it('should be error message', async () => {
      const { message } = await battleModel.createNewBattle({ lkkdfs: 'dfsdf' });
      expect(message).to.be.exist;
    });
  });
});
