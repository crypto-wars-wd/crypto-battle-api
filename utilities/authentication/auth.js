const {
  signUpSocial,
  signInSocial,
  findUserBySocial,
  findUserByEmail,
} = require('models/userModel');
const { generateSession } = require('./sessions');

exports.socialAuth = async ({
  alias, provider, avatar, id, postLocales, email,
}) => {
  const userBySocial = await findUserBySocial({ id, provider });
  const session = generateSession();

  if (!userBySocial && email) {
    const userByEmail = await findUserByEmail({ email });

    if (userByEmail) return { message: 'User exist' };
    const { user, session: existSession, message } = await signUpSocial({
      alias, avatar, provider, id, session, postLocales, email,
    });
    return { message };
  }
  if (!userBySocial) return { message: 'Invalid data fields' };
  return await signInSocial({ id, userId: userBySocial._id, session });
};
