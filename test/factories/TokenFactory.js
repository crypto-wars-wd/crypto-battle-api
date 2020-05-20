const crypto = require('crypto-js');
const config = require('config');
const { ObjectID, rewire } = require('test/testHelper');

const AuthRewire = rewire('utilities/authentication/sessions');
const tokenSign = AuthRewire.__get__('tokenSign');

const encodeToken = ({ accessToken }) => crypto.AES.encrypt(accessToken, config.cryptoKey).toString();
const decodeToken = async ({ accessToken }) => crypto.AES.decrypt(accessToken, config.cryptoKey).toString(crypto.enc.Utf8);

const create = async (data = {}) => {
  const session = {
    sid: new ObjectID(),
    secretToken: crypto.SHA512(`${new Date()}`).toString(),
  };
  const authToken = await tokenSign(data.client, session);

  return {
    session,
    authToken: encodeToken(authToken),
  };
};


module.exports = { create, decodeToken, encodeToken };
