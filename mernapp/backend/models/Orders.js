import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema({
  order_data: [{ name: String, qty: Number, size: String, price: Number }],
  email: String,
  token: String,
  order_date: String,
});

export default mongoose.model("Order", OrderSchema);
