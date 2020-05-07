const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserAuthSchema = new Schema(
  {
    id: { type: String },
    provider: { type: String },
    sessions: [{
      sid: { type: String, required: true },
      secret_token: { type: String, required: true },
    }],
  }, { _id: false },
);

const UserSchema = new Schema({
  name: {
    type: String, index: true, unique: true, required: true,
  },
  alias: { type: String },
  objects_follow: { type: [String], default: [] }, // arr of author_permlink of objects what user following
  users_follow: { type: [String], default: [] }, // arr of users which user follow
  auth: { type: UserAuthSchema },
  followers_count: { type: Number, default: 0 },
}, { timestamps: true });

UserSchema.index({ wobjects_weight: -1 });

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
