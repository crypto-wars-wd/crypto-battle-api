const {
  expect, app, faker, chai, Battle, ObjectID, dropDatabase, battleModel,
} = require('test/testHelper');
const _ = require('lodash');
const { UserFactory, BattleFactory } = require('test/factories');
const { POPULATE_PATH_PLAYER1, POPULATE_PATH_PLAYER2 } = require('utilities/constants');

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
      const battle = Battle.findOne({ 'firstPlayer.playerID': data.playerID });
      expect(battle).to.be.exist;
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
  describe('On connectBattle', async () => {
    const users = [];
    let result, data, battle;
    before(async () => {
      for (let count = 0; count < 2; count++) {
        users.push(await UserFactory.createUser({
          numberOfVictories: faker.random.number(),
          auth: {
            id: new ObjectID(),
            provider: faker.name.firstName(),
          },
        }));
      }
      battle = await BattleFactory.createNewBattle({
        playerID: users[0]._id,
        cryptoName: faker.name.firstName(),
        healthPoints: faker.random.number({
          min: 10,
          max: 300,
        }),
      });
    });
    describe('On Success', async () => {
      before(async () => {
        data = {
          cryptoName: faker.name.firstName(),
          playerID: users[1]._id,
          battleID: battle._id,
          message: faker.name.firstName(),
        };
        result = await chai.request(app)
          .post('/api/connect-battle')
          .send(data);
      });
      it('should return status 200', async () => {
        expect(result).to.have.status(200);
      });
      it('Should return first player playerID ', async () => {
        const { playerID } = result.body.battle.firstPlayer;
        expect(playerID).to.be.eq(users[0]._id.toString());
      });
      it('Should return second player playerID ', async () => {
        const { playerID } = result.body.battle.secondPlayer;
        expect(playerID).to.be.eq(users[1]._id.toString());
      });
      it('Should return all keys first player', async () => {
        const { firstPlayer } = result.body.battle;
        expect(firstPlayer).to.have.all.keys('cryptoName', 'playerID', 'userInfo');
      });
      it('Should return all keys second player', async () => {
        const { secondPlayer } = result.body.battle;
        expect(secondPlayer).to.have.all.keys('cryptoName', 'playerID', 'userInfo');
      });
      it('Should return start game status when game started', async () => {
        const { gameStatus } = result.body.battle;
        expect(gameStatus).to.be.eq('START');
      });
      it('Should return right number of hp ', async () => {
        const { healthPoints } = result.body.battle;
        expect(healthPoints).to.be.eq(battle.healthPoints);
      });
    });
    describe('On error', async () => {
      it('Should return status 422, when one of the parameters is missing', async () => {
        result = await chai.request(app)
          .post('/api/connect-battle')
          .send({
            cryptoName: faker.name.firstName(),
            playerID: users[1]._id,
          });
        expect(result).to.have.status(422);
      });
      it('Should return error when battle ID parameter is missing', async () => {
        result = await chai.request(app)
          .post('/api/connect-battle')
          .send({
            cryptoName: faker.name.firstName(),
            playerID: users[1]._id,
          });
        const { message } = result.body.error.details[0];
        expect(message).to.be.eq('"battleID" is required');
      });
      it('Should return error when player ID parameter is missing', async () => {
        result = await chai.request(app)
          .post('/api/connect-battle')
          .send({
            cryptoName: faker.name.firstName(),
            battleID: battle._id,
          });
        const { message } = result.body.error.details[0];
        expect(message).to.be.eq('"playerID" is required');
      });
      it('Should return error when crypto name parameter is missing', async () => {
        result = await chai.request(app)
          .post('/api/connect-battle')
          .send({
            playerID: users[1]._id,
            battleID: battle._id,
          });
        const { message } = result.body.error.details[0];
        expect(message).to.be.eq('"cryptoName" is required');
      });
      it('Should return error when battle ID dont have in database', async () => {
        result = await chai.request(app)
          .post('/api/connect-battle')
          .send({
            cryptoName: faker.name.firstName(),
            playerID: users[1]._id,
            battleID: new ObjectID(),
            message: faker.name.firstName(),
          });
        const { battle: battleResult } = result.body;
        expect(battleResult).to.be.null;
      });
    });
  });
});
