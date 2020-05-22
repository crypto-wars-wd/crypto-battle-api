const {
  expect, app, chai, dropDatabase, ObjectID, User,
} = require('test/testHelper');
const { UserFactory, TokenFactory } = require('test/factories');

describe('authenticationController', async () => {
  describe('test logout', async () => {
    let user, payload, session, authToken;
    beforeEach(async () => {
      await dropDatabase();
      user = await UserFactory.createUser({ auth: { id: new ObjectID(), sessions: [session] } });
      payload = {
        id: user._id,
      };
      const tokenData = await TokenFactory.create({ client: user });
      await user.set({ auth: { sessions: [tokenData.session] } });
      await user.save();
      authToken = tokenData.authToken;
    });

    it('should return success', async () => {
      const result = await chai.request(app)
        .post('/api/logout')
        .set({ 'access-token': authToken })
        .send(payload);
      expect(result).to.have.status(200);
    });
    it('should return result to be deep equal to payload', async () => {
      await chai.request(app)
        .post('/api/logout')
        .set({ 'access-token': authToken })
        .send(payload);
      const findUser = await User.findOne({ _id: user._id });
      expect(findUser.auth.sessions.length).to.be.eq(0);
    });
    it('should return unauthorized without access token', async () => {
      const result = await chai.request(app)
        .post('/api/logout')
        .set({ 'access-token': 'some_token' })
        .send(payload);
      expect(result).to.have.status(401);
    });
    it('should return error when request with empty body', async () => {
      const result = await chai.request(app)
        .post('/api/logout')
        .set({ 'access-token': authToken });
      expect(result).to.have.status(422);
    });
  });
});
