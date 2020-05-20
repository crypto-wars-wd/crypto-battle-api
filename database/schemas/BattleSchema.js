const mongoose = require('mongoose');

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
    playerID: { type: String },
    cryptoName: { type: String },
  },
  looser: {
    playerID: { ttype: Schema.Types.ObjectId },
    cryptoName: { type: Schema.Types.ObjectId },
  },
}, { toObject: { virtuals: true }, toJSON: { virtuals: true }, timestamps: true });

BattleSchema.virtual('player1', {
  ref: 'users',
  localField: 'firstPlayer.playerID',
  foreignField: '_id',
  justOne: true,
});


const BattleModel = mongoose.model('Battle', BattleSchema, 'battles');

module.exports = BattleModel;
