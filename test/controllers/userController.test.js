const {
  expect, app, chai, dropDatabase, ObjectID,
} = require('test/testHelper');
const { UserFactory, TokenFactory } = require('test/factories');

describe('userController', async () => {
  describe('updateUserInfo', async () => {
    let user, payload, session, authToken;
    beforeEach(async () => {
      await dropDatabase();
      user = await UserFactory.createUser({ auth: { id: new ObjectID(), sessions: [session] } });
      payload = {
        id: user._id,
        avatar: user.avatar,
        alias: user.alias,
      };
      const tokenData = await TokenFactory.create({ client: user });
      await user.set({ auth: { sessions: [tokenData.session] } });
      await user.save();
      authToken = tokenData.authToken;
    });

    it('should return unauthorized without access token', async () => {
      const result = await chai.request(app)
        .post('/api/update-user-info')
        .set({ 'access-token': 'some_token' })
        .send(payload);
      expect(result).to.have.status(401);
    });
    it('should return success', async () => {
      const result = await chai.request(app)
        .post('/api/update-user-info')
        .set({ 'access-token': authToken })
        .send(payload);
      console.log(result);
      expect(result).to.have.status(200);
    });
  });
});
