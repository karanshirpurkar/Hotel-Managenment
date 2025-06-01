const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  chairs: { type: Number, default: 3 },
  status: { type: String, enum: ['available', 'occupied'], default: 'available' },
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null }
});

module.exports = mongoose.model('Table', tableSchema);