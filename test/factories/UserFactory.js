const { faker, User } = require('test/testHelper');

const createUser = async ({
  alias, avatar, onlyData,
} = {}) => {
  const userData = {
    alias: alias || `${faker.name.firstName()}`,
    avatar: avatar || `${faker.name.firstName()}${faker.random.number()}`,
  };
  if (onlyData) return userData;
  const user = new User(userData);

  await user.save();
  user.toObject();
  return user;
};

module.exports = { createUser };
