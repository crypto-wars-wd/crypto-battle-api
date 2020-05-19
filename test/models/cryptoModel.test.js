const {
  expect, dropDatabase, cryptoModel, assert, models,
} = require('test/testHelper');
const { CryptoFactory } = require('test/factories');

describe('cryptoModel', async () => {
  describe('findAllCrypto', async () => {
    let battleData, mockData;

    beforeEach(async () => {
      await dropDatabase();
      const firstCrypto = await CryptoFactory.createNewCrypto();
    });
    it('should ', async () => {

    });
  });
});
