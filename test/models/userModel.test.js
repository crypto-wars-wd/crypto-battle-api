const {
  expect, userModel, faker, User, ObjectID, dropDatabase, crypto,
} = require('test/testHelper');

const { UserFactory } = require('test/factories');

describe('userModel', async () => {
  describe('updateUserInfo', async () => {
    let user, data, updUser, resultUpdate;
    beforeEach(async () => {
      user = await UserFactory.createUser();
      data = {
        id: user._id,
        alias: user.alias,
        avatar: user.avatar,
      };
      resultUpdate = await userModel.updateUserInfo(data);
      updUser = await User.findOne({ _id: user._id });
    });
    it('should result update successfully', async () => {
      expect(resultUpdate).to.be.exist;
    });
    it('should compare fields so they are the same ', async () => {
      expect({ alias: updUser.alias, avatar: updUser.avatar })
        .to.be.deep.eq({ alias: user.alias, avatar: user.avatar });
    });
    it('should compare data properties and upd_post properties after update', async () => {
      expect(data).to.deep.eq({
        alias: updUser.alias,
        avatar: updUser.avatar,
        id: updUser._id,
      });
    });
    it('should return error', async () => {
      const { error } = await userModel.updateUserInfo({ id: `${faker.name.firstName()}${faker.random.number()}` });
      expect(error).to.be.exist;
    });
  });

  describe('test destroySession', async () => {
    let user, session, session2;
    beforeEach(async () => {
      await dropDatabase();
      session = {
        _id: new ObjectID(),
        sid: new ObjectID(),
        secretToken: crypto.SHA512(`${new Date()}`).toString(),
      };
      session2 = {
        _id: new ObjectID(),
        sid: new ObjectID(),
        secretToken: crypto.SHA512(`${new Date()}`).toString(),
      };
    });

    it('remove user session', async () => {
      user = await UserFactory.createUser({ auth: { sessions: [session] } });
      await userModel.destroySession({ userId: user._id, session });
      const findUser = await User.findOne({ _id: user._id }).select('+auth');
      expect(findUser.auth.sessions.length).to.be.eq(0);
    });
    it('remove user session with many sessions', async () => {
      user = await UserFactory.createUser({ auth: { sessions: [session, session2] } });
      await userModel.destroySession({ userId: user._id, session });
      const findUser = await User.findOne({ _id: user._id }).select('+auth');
      expect(findUser.auth.sessions.length).to.be.eq(1);
    });
  });
  describe('test findTopWarriors', async () => {
    let warriors, auth;
    beforeEach(async () => {
      await dropDatabase();
      for (let i = 0; i < 15; i++) {
        auth = {
          id: new ObjectID(),
          provider: faker.name.firstName(),
        };
        await UserFactory.createUser({ numberOfVictories: faker.random.number(), auth });
      }
    });

    it('warriors should be an array with length 10', async () => {
      ({ warriors } = await userModel.findTopWarriors({ limit: 10, skip: 0 }));
      expect(warriors).to.be.an('array').to.have.length(10);
    });
    it('sort numberOfVictories must be from biggest number to lowest', async () => {
      ({ warriors } = await userModel.findTopWarriors({ limit: 10, skip: 0 }));
      expect(warriors[0].numberOfVictories).to.be.above(warriors[9].numberOfVictories);
    });
  });
});
