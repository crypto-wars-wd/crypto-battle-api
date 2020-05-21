const { battleModel } = require('models');

module.exports = async ({ state, playerID }) => {
  switch (state) {
    case 'all':
      return battleModel.getBattlesByState({ gameStatus: /^/, playerID });
    default:
      return battleModel.getBattlesByState({ gameStatus: state.toUpperCase(), playerID });
  }
};
