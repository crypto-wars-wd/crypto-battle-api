const _ = require('lodash');
const config = require('config');
const { User } = require('database').models;

const destroyLastSession = async ({ user }) => {
  if (_.get(user, 'auth.sessions', false) && user.auth.sessions.length > config.limitSessions) {
    await User.updateOne({ _id: user._id }, { $pull: { 'auth.sessions': { _id: user.auth.sessions[0]._id } } });
  }
};

const destroySession = async ({ userId, session }) => {
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

const findUserBySocial = async ({ id, provider }) => User.findOne({ 'auth.provider': provider, 'auth.id': id }).select('+auth').lean();

const findUserById = async (id) => {
  try {
    return { user: await User.findOne({ _id: id }).select('+auth').lean() };
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
      warriors: await User.find().sort({ numberOfVictories: 'desc' }).skip(skip)
        .limit(limit)
        .lean(),
    };
  } catch (error) {
    return { error };
  }
};

const updateOne = async ({ condition, updateData }) => {
  try {
    return { user: await User.updateOne(condition, updateData) };
  } catch (error) {
    return { error };
  }
};

const findOneSelect = async ({ condition, select }) => {
  try {
    return { user: await User.findOne(condition).select(select).lean() };
  } catch (error) {
    return { error };
  }
};

module.exports = {
  updateOne,
  destroyLastSession,
  findUserBySocial,
  findTopWarriors,
  updateUserInfo,
  destroySession,
  updateSession,
  signUpSocial,
  signInSocial,
  findUserById,
  findOneSelect,
};
