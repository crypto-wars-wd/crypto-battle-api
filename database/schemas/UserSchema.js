const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserAuthSchema = new Schema({
  id: { type: String },
  provider: { type: String },
  sessions: [{
    sid: { type: String, required: true },
    secretToken: { type: String, required: true },
  }],
}, { _id: false });

const UserSchema = new Schema({
  level: { type: Number, default: 1 },
  health: { type: Number, default: 100 },
  alias: { type: String },
  avatar: { type: String },
  auth: { type: UserAuthSchema },
}, { timestamps: true });

UserAuthSchema.index({ provider: 1, id: 1 }, { unique: true });

const UserModel = mongoose.model('User', UserSchema, 'users');

module.exports = UserModel;
