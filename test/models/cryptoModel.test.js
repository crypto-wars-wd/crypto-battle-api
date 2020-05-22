const {
  expect, dropDatabase, cryptoModel,
} = require('test/testHelper');
const { CryptoFactory } = require('test/factories');
const _ = require('lodash');

describe('cryptoModel', async () => {
  describe('findAllCrypto', async () => {
    let random;
    beforeEach(async () => {
      await dropDatabase();
      random = _.random(0, 20);
      for (let i = 0; i < random; i++) {
        await CryptoFactory.createNewCrypto();
      }
    });
    it('should return array of random objects', async () => {
      const { crypto } = await cryptoModel.findAllCrypto();
      expect(crypto.length).to.be.eq(random);
    });
  });
});
