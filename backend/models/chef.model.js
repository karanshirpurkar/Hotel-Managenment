const mongoose = require('mongoose');
const chefSchema = new mongoose.Schema({
  name: String,
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});
module.exports = mongoose.model('Chef', chefSchema);