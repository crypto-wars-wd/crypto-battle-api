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

const AccountSchema = new Schema({
  hiveName: { type: String, unique: true },
  steemName: { type: String },
  HIVE: { type: Number, default: 0 },
  HBD: { type: Number, default: 0 },
  STEEM: { type: Number, default: 0 },
  SBD: { type: Number, default: 0 },
}, { _id: false });

const UserSchema = new Schema({
  level: { type: Number, default: 1 },
  health: { type: Number, default: 100 },
  numberOfVictories: { type: Number, default: 0 },
  numberOfLosses: { type: Number, default: 0 },
  numberOfFights: { type: Number, default: 0 },
  alias: { type: String },
  avatar: { type: String },
  auth: { type: UserAuthSchema, select: false },
  personalAccount: { type: AccountSchema, select: false },
}, { timestamps: true });

UserAuthSchema.index({ provider: 1, id: 1 }, { unique: true });

const UserModel = mongoose.model('User', UserSchema, 'users');

module.exports = UserModel;
