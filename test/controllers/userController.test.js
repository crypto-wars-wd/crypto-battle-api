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

    it('should return success', async () => {
      const result = await chai.request(app)
        .post('/api/update-user-info')
        .set({ 'access-token': authToken })
        .send(payload);
      expect(result).to.have.status(200);
    });
    it('should return result to be deep equal to payload', async () => {
      let result = null;
      ({ body: result } = await chai.request(app)
        .post('/api/update-user-info')
        .set({ 'access-token': authToken })
        .send(payload));
      expect({ alias: result.user.alias, avatar: result.user.avatar })
        .to.be.deep.eq({ alias: payload.alias, avatar: payload.avatar });
    });
    it('should return unauthorized without access token', async () => {
      const result = await chai.request(app)
        .post('/api/update-user-info')
        .set({ 'access-token': 'some_token' })
        .send(payload);
      expect(result).to.have.status(401);
    });
    it('should return error empty body', async () => {
      const result = await chai.request(app)
        .post('/api/update-user-info')
        .set({ 'access-token': authToken });
      expect(result).to.have.status(422);
    });
    it('should return error missing id', async () => {
      const result = await chai.request(app)
        .post('/api/update-user-info')
        .set({ 'access-token': authToken })
        .send({ alias: payload.alias, avatar: payload.avatar });
      expect(result).to.have.status(422);
    });
    it('should return error missing alias', async () => {
      const result = await chai.request(app)
        .post('/api/update-user-info')
        .set({ 'access-token': authToken })
        .send({ avatar: payload.avatar, id: payload.id });
      expect(result).to.have.status(422);
    });
    it('should return error missing avatar', async () => {
      const result = await chai.request(app)
        .post('/api/update-user-info')
        .set({ 'access-token': authToken })
        .send({ alias: payload.alias, id: payload.id });
      expect(result).to.have.status(422);
    });
  });
});
