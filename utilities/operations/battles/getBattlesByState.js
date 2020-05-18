const { battleModel } = require('models');

module.exports = async ({ state }) => {
  switch (state) {
    case 'all':
      return battleModel.getBattlesByState({ gameStatus: /^/ });
    default:
      return battleModel.getBattlesByState({ gameStatus: state.toUpperCase() });
  }
};
