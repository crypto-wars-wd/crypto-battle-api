module.exports = {
  strategies: require('./auth/authStrategies'),
  creating: require('./battle/creating'),
  logoutUser: require('./auth/logout'),
  getBattleData: require('./battle/getBattleData'),
};
