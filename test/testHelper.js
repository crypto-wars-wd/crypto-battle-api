const chai = require('chai');
const faker = require('faker');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.use(sinonChai);
const { expect, assert } = chai;
const { Mongoose, models } = require('database');

const dropDatabase = async () => {
  for (const model in models) {
    await models[model].deleteMany();
  }
};

module.exports = {
  app: require('app'),
  ...require('database').models,
  ...require('models'),
  sinon: require('sinon'),
  Mongoose,
  models,
  faker,
  chai,
  expect,
  assert,
  dropDatabase,
};
