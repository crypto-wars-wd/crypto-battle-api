const mongoose = require('mongoose');

const { Schema } = mongoose;

const cryptoSchema = new Schema({
  cryptoName: { type: String, unique: true, required: true },
  numberOfVictories: { type: Number, default: 0 },
  numberOfLosses: { type: Number, default: 0 },
  numberOfFights: { type: Number, default: 0 },
}, { timestamps: true });

const CryptoModel = mongoose.model('Crypto', cryptoSchema, 'crypto-currencies');

module.exports = CryptoModel;
