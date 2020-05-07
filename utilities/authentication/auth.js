const {
  signUpSocial,
  signInSocial,
  findUserBySocial,
  findUserByName,
} = require('models/userModel');
const { generateSession } = require('./sessions');

exports.socialAuth = async ({
  userName, alias, provider, avatar, id, postLocales, email,
}) => {
  const userBySocial = await findUserBySocial({ id, provider });
  const session = generateSession();

  if (!userBySocial && userName) {
    const userByName = await findUserByName({ name: userName });

    if (userByName) return { message: 'User exist' };
    const { user, session: existSession, message } = await signUpSocial({
      userName, alias, avatar, provider, id, session, postLocales, email,
    });
    return { message };
  }
  if (!userBySocial) return { message: 'Invalid data fields' };
  return await signInSocial({ id, user_id: userBySocial._id, session });
};
