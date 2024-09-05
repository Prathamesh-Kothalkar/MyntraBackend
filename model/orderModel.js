const mongoose = require("mongoose");
const Cart = require("./cartModel");

const orderSchema = new mongoose.Schema({
  items: { type: [Cart.schema], required: true },
  paymentStatus: {
    type: String,
  },
  paymentId: { type: String },
  orderStatus: {
    type: String,
  },
  address:{
    type:String
  },
  amount:{
    type:Number
  }
});

const ordersSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orders: [orderSchema]
});

const Order = mongoose.model("Order", ordersSchema);

module.exports = Order;
