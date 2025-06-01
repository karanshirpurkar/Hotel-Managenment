const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  cart: [
    {
      name: { type: String, required: true },
      count: { type: Number, required: true }
    }
  ],
  customer: {
    mobile: { type: String, required: true }
  },
  duration: {
    type: Number,
    required: true
  },
  orderType: {
    type: String,
    enum: ['Dine In', 'Take Away'], // Add/remove types as needed
    required: true
  },
  total_Price: {
    type: Number,
    required: true
  },
  pickedUp: {
    type: Boolean,
    default: false
  },
table: {
  type: Number, // store just the table number
  required: false
},
  status:{
    type: String, 
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
