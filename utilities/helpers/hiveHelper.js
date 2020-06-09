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

const checkBankBalance = async ({ amount, cryptoType }) => {
  const accounts = await hiveClient.database.call('get_accounts', [[process.env.HIVE_ACCOUNT_NAME || '']]);
  const hiveBalance = accounts[0].balance.split(' ')[0];
  const hbdBalance = accounts[0].sbd_balance.split(' ')[0];

  switch (cryptoType) {
    case 'HIVE':
      return hiveBalance >= amount;
    case 'HBD':
      return hbdBalance >= amount;
    default: return false;
  }
};

module.exports = {
  transfer,
  checkBankBalance,
};
