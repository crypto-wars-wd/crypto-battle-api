const {
  expect, app, faker, chai, Battle, ObjectID, dropDatabase,
} = require('test/testHelper');
const { UserFactory } = require('test/factories');

describe('battleController', async () => {
  describe('createBattle on success', async () => {
    let data, result, auth, user;
    beforeEach(async () => {
      auth = {
        id: new ObjectID(),
        provider: faker.name.firstName(),
      };
      user = await UserFactory.createUser({ numberOfVictories: faker.random.number(), auth });
      data = {
        cryptoName: `${faker.name.firstName()}`,
        playerID: user._id,
        healthPoints: faker.random.number(),
      };
      result = await chai.request(app)
        .post('/api/create-battle')
        .send(data);
    });
    it('should exist', async () => {
      const battle = Battle.findOne({ 'playersInfo.firstPlayer.playerID': data.playerID });
      expect(battle).to.exist;
    });
    it('should return status 200', async () => {
      expect(result).to.have.status(200);
    });
    it('should return correct cryptoName', async () => {
      expect(result.body.battle.firstPlayer.cryptoName).to.be.eq(data.cryptoName);
    });
    it('should return correct cryptoName in body', async () => {
      expect(result.body.battle.firstPlayer.cryptoName).to.be.eq(data.cryptoName);
    });
    it('should return correct healthPoints in body', async () => {
      expect(result.body.battle.healthPoints).to.be.eq(data.healthPoints);
    });
  });
  describe('createBattle on error missing one of arguments (healthPoints)', async () => {
    let data, result, user, auth;
    beforeEach(async () => {
      auth = {
        id: new ObjectID(),
        provider: faker.name.firstName(),
      };
      user = await UserFactory.createUser({ numberOfVictories: faker.random.number(), auth });
      data = {
        cryptoName: `${faker.name.firstName()}`,
        playerID: user._id,
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
  describe('getCryptoCurrencies', async () => {
    let result;
    beforeEach(async () => {
      result = await chai.request(app)
        .get('/api/crypto-currencies');
    });
    it('should return status 200', async () => {
      expect(result).to.have.status(200);
    });
  });
  describe('getTopWarriors', async () => {
    let result, auth;
    beforeEach(async () => {
      await dropDatabase();
      for (let i = 0; i < 16; i++) {
        auth = {
          id: new ObjectID(),
          provider: faker.name.firstName(),
        };
        await UserFactory.createUser({ numberOfVictories: faker.random.number(), auth });
      }
    });
    it('should return status 200', async () => {
      result = await chai.request(app)
        .get('/api/top-warriors');
      expect(result).to.have.status(200);
    });
    it('should return  warriors.length of 15', async () => {
      result = await chai.request(app)
        .get('/api/top-warriors');
      expect(result.body.warriors.length).to.be.eq(10);
    });
    it('should return warriors.length of 15', async () => {
      result = await chai.request(app)
        .get('/api/top-warriors?limit=15');
      expect(result.body.warriors.length).to.be.eq(15);
    });
    it('should return hasMore true', async () => {
      result = await chai.request(app)
        .get('/api/top-warriors?limit=15');
      expect(result.body.hasMore).to.be.eq(true);
    });
    it('should return hasMore false', async () => {
      result = await chai.request(app)
        .get('/api/top-warriors?limit=16');
      expect(result.body.hasMore).to.be.eq(false);
    });
  });
});
