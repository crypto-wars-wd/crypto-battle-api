const mongoose = require('mongoose');
const { POPULATE_PATH_PLAYER1, POPULATE_PATH_PLAYER2 } = require('utilities/constants');

const { Schema } = mongoose;

const BattleSchema = new Schema({
  firstPlayer: {
    cryptoName: { type: String, required: true },
    playerID: { type: Schema.Types.ObjectId, required: true },
    extraLife: { type: Number },
  },
  secondPlayer: {
    cryptoName: { type: String },
    playerID: { type: Schema.Types.ObjectId },
    extraLife: { type: Number },
  },
  healthPoints: { type: Number, required: true },
  steps: { type: Array, default: [] },
  gameStatus: { type: String, default: 'WAITING' },
  winner: {
    playerID: { type: Schema.Types.ObjectId },
    cryptoName: { type: String },
  },
  loser: {
    playerID: { type: Schema.Types.ObjectId },
    cryptoName: { type: String },
  },
}, { toObject: { virtuals: true }, toJSON: { virtuals: true }, timestamps: true });

BattleSchema.virtual(POPULATE_PATH_PLAYER1, {
  ref: 'User',
  localField: 'firstPlayer.playerID',
  foreignField: '_id',
  justOne: true,
});

BattleSchema.virtual(POPULATE_PATH_PLAYER2, {
  ref: 'User',
  localField: 'secondPlayer.playerID',
  foreignField: '_id',
  justOne: true,
});

const BattleModel = mongoose.model('Battle', BattleSchema, 'battles');

module.exports = BattleModel;
