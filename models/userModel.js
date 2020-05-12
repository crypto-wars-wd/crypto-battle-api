const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const config = require('config');
const { User } = require('database').models;

const destroyLastSession = async ({ user }) => {
  if (_.get(user, 'auth.sessions', false) && user.auth.sessions.length > config.limit_sessions) {
    await User.updateOne({ _id: user._id }, { $pull: { 'auth.sessions': { _id: user.auth.sessions[0]._id } } });
  }
};

const destroySession = async ({ userId, session }) => {
  await User.updateOne({ _id: userId }, { $pull: { 'auth.sessions': { _id: session._id } } });
};

const updateSession = (doc, newSession) => User.updateOne({ _id: doc._id }, { $push: { 'auth.sessions': newSession } });

const findUserBySocial = async ({ id, provider }) => User.findOne({ 'auth.provider': provider, 'auth.id': id }).lean();

const findUserById = async (id) => {
  try {
    return { user: await User.findOne({ _id: id }).lean() };
  } catch (error) {
    return { error };
  }
};

const signUpSocial = async ({
  alias, provider, avatar, id, session, email,
}) => {
  const user = new User({
    email,
    alias,
    avatar,
    'auth.sessions': [session],
    'auth.provider': provider,
    'auth.id': id,
  });
  try {
    await user.save();
    const access_token = prepareToken({ user, session });
    const { message } = userObjectCreate({
      userId: user.email,
      displayName: alias || '',
      access_token,
    });

    if (message) {
      await User.deleteOne({ _id: user._id });
      return { message };
    }
  } catch (err) {
    return { message: err };
  }
  return { user: user.toObject(), session };
};

const signInSocial = async ({ userId, session }) => {
  const user = await User.findOneAndUpdate({ _id: userId }, { $push: { 'auth.sessions': session } }, { new: true }).lean();

  await destroyLastSession({ user });
  return { user, session };
};

const userObjectCreate = ({
  userId, displayName, access_token,
}) => ({
  params: {
    id: 'waivio_guest_create',
    json: {
      userId, displayName,
    },
  },
  access_token,
});

const prepareToken = ({ user, session }) => {
  const access_token = jwt.sign({ name: user.name, id: user._id, sid: session.sid }, session.secretToken, { expiresIn: config.session_expiration });

  return crypto.AES.encrypt(access_token, process.env.CRYPTO_KEY || 'db5c57b3fc1c105e772a3784df6b798c').toString();
};

module.exports = {
  signUpSocial,
  signInSocial,
  findUserBySocial,
  destroyLastSession,
  destroySession,
  findUserById,
  updateSession,
};
