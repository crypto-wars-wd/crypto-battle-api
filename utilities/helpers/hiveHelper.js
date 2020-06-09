const _ = require('lodash');
const dsteem = require('@hivechain/dsteem');

const { Asset } = dsteem;
const hiveClient = new dsteem.Client('https://anyx.io');

const transfer = async ({
  from, to, amount, memo = '', activeKey, cryptoType,
}) => {
  const key = await dsteem.PrivateKey.fromString(activeKey);

  return hiveClient.broadcast.transfer({
    from, to, amount: new Asset(amount, cryptoType), memo,
  }, key).then(
    () => ({ result: true }),
    (error) => ({ error }),
  );
};

const getAccountInfo = async (name) => {
  const accounts = await hiveClient.database.call('get_accounts', [[name]]);

  if (!_.isEmpty(accounts)) return accounts[0];
  return null;
};

module.exports = {
  transfer,
  getAccountInfo,
};
