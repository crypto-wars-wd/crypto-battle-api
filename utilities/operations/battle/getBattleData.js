const { userModel } = require('models');
const render = require('concerns/render');

module.exports = async (req, res, params) => {
  const { warriors, findWarriorsError } = await userModel
    .findTopWarriors({ limit: params.limit + 1, skip: params.skip });
  if (findWarriorsError) return render.error(res, findWarriorsError);

  return { warriors: warriors.slice(0, params.limit), hasMore: warriors.length > params.limit };
};
