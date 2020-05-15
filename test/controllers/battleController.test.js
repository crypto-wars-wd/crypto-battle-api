const {
  expect, app, faker, chai,
} = require('test/testHelper');

describe('battleController', async () => {
  describe('createBattle on success', async () => {
    let data, result;
    beforeEach(async () => {
      data = {
        cryptoName: `${faker.name.firstName()}`,
        playerID: `${faker.name.firstName()}${faker.random.number()}`,
        healthPoints: faker.random.number(),
      };
      result = await chai.request(app)
        .post('/api/create-battle')
        .send(data);
    });
    it('should return status 200', async () => {
      expect(result).to.have.status(200);
    });
    it('should return correct cryptoName', async () => {
      expect(result.body.battle.playersInfo.firstPlayer.cryptoName).to.be.eq(data.cryptoName);
    });
    it('should return correct cryptoName in body', async () => {
      expect(result.body.battle.playersInfo.firstPlayer.cryptoName).to.be.eq(data.cryptoName);
    });
    it('should return correct playerID in body', async () => {
      expect(result.body.battle.playersInfo.firstPlayer.playerID).to.be.eq(data.playerID);
    });
    it('should return correct healthPoints in body', async () => {
      expect(result.body.battle.playersInfo.healthPoints).to.be.eq(data.healthPoints);
    });
  });
  describe('createBattle on error missing one of arguments (healthPoints)', async () => {
    let data, result;
    beforeEach(async () => {
      data = {
        cryptoName: `${faker.name.firstName()}`,
        playerID: `${faker.name.firstName()}${faker.random.number()}`,
      };
      result = await chai.request(app)
        .post('/api/create-battle')
        .send(data);
    });
    it('should return status 200', async () => {
      expect(result).to.have.status(422);
    });
    it('should return error in body', async () => {
      expect(result.body.error).to.be.exist;
    });
    it('should return correct body success', async () => {
      expect(result.body.success).to.be.eq(false);
    });
  });
});
