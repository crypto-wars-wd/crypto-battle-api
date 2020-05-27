const _ = require('lodash');
const config = require('config');
const { User } = require('database').models;

const destroyLastSession = async ({ user }) => {
  if (_.get(user, 'auth.sessions', false) && user.auth.sessions.length > config.limitSessions) {
    await User.updateOne({ _id: user._id }, { $pull: { 'auth.sessions': { _id: user.auth.sessions[0]._id } } });
  }
};

const destroySession = async ({ userId, session }) => {
  await User.updateOne({ _id: userId }, { $pull: { 'auth.sessions': { _id: session._id } } });
  try {
    return {
      successDestroy: await User.updateOne({ _id: userId }, { $pull: { 'auth.sessions': { _id: session._id } } }),
    };
  } catch (error) {
    return { error };
  }
};

const updateSession = (doc, newSession) => User.updateOne({ _id: doc._id }, { $push: { 'auth.sessions': newSession } });

const updateUserInfo = async ({ id, alias, avatar }) => {
  try {
    return {
      user: await User.findOneAndUpdate({ _id: id }, { alias, avatar }, { new: true })
        .lean(),
    };
  } catch (error) {
    return { error };
  }
};

const findUserBySocial = async ({ id, provider }) => User.findOne({ 'auth.provider': provider, 'auth.id': id }).lean();

const findUserById = async (id) => {
  try {
    return { user: await User.findOne({ _id: id }).lean() };
  } catch (error) {
    return { error };
  }
};

const signUpSocial = async ({
  alias, provider, avatar, id, session,
}) => {
  const user = new User({
    alias,
    avatar,
    'auth.sessions': [session],
    'auth.provider': provider,
    'auth.id': id,
  });
  try {
    await user.save();
  } catch (error) {
    return { error };
  }
  return { user: user.toObject(), session };
};

const signInSocial = async ({ userId, session }) => {
  const user = await User.findOneAndUpdate({ _id: userId }, { $push: { 'auth.sessions': session } }, { new: true }).lean();

  await destroyLastSession({ user });
  return { user, session };
};

const findTopWarriors = async ({ limit, skip }) => {
  try {
    return {
      warriors: await User.find().sort({ numberOfVictories: 'desc' }).skip(skip).limit(limit)
        .lean(),
    };
  } catch (error) {
    return { error };
  }
};

const updateUserResultBattle = async ({ playerID, resultBattle }) => {
  try {
    await Promise.all(playerID.map(async (id) => {
      await User.updateOne({ _id: id }, {
        $inc: {
          numberOfLosses: (resultBattle) === 'lose' ? 1 : 0,
          numberOfVictories: (resultBattle) === 'win' ? 1 : 0,
          numberOfFights: 1,
        },
      });
    }));
  } catch (error) {
    return { error };
  }
};

module.exports = {
  updateUserResultBattle,
  destroyLastSession,
  findUserBySocial,
  findTopWarriors,
  updateUserInfo,
  destroySession,
  updateSession,
  signUpSocial,
  signInSocial,
  findUserById,
};
