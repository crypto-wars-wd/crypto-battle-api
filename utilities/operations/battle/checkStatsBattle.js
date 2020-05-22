const { battleModel } = require('models');
const checkResultBattle = require('utilities/operations/battle/checkResultBattle');

module.exports = async (params) => {
  const battles = [];
  for (let count = 0; count < params.length; count++) {
    const { battle, error } = await battleModel.updateStatsBattle(params[count]);
    if (error) return { error };
    if (battle) {
      battles.push(battle);
      if (battle.gameStatus === 'END') {
        const { error: checkResultError } = await checkResultBattle(battle);
        if (checkResultError) return { error: checkResultError };
      }
    }
  }
  return { battles };
};
