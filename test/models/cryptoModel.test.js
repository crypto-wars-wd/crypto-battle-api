const {
  expect, dropDatabase, cryptoModel,
} = require('test/testHelper');
const { CryptoFactory } = require('test/factories');

describe('cryptoModel', async () => {
  describe('findAllCrypto', async () => {
    beforeEach(async () => {
      await dropDatabase();
      await CryptoFactory.createNewCrypto();
      await CryptoFactory.createNewCrypto();
      await CryptoFactory.createNewCrypto();
    });
    it('should return array of 3 object', async () => {
      const { crypto } = await cryptoModel.findAllCrypto();
      expect(crypto.length).to.be.eq(3);
    });
  });
});
