const chai = require('chai');
const faker = require('faker');
const rewire = require('rewire');
const crypto = require('crypto-js');
const { ObjectID } = require('bson');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiHttp);
chai.use(sinonChai);
chai.use(chaiAsPromised);
const { expect, assert } = chai;
const { Mongoose, models } = require('database');

const dropDatabase = async () => {
  for (const model in models) {
    await models[model].deleteMany();
  }
};

module.exports = {
  ...require('database').models,
  sinon: require('sinon'),
  ...require('models'),
  app: require('app'),
  dropDatabase,
  ObjectID,
  Mongoose,
  models,
  expect,
  assert,
  rewire,
  crypto,
  faker,
  chai,
};
