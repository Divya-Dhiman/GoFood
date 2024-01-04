import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  order_data: [
    {
      Order_date: {
        type: Date,
        default: Date.now,
      },
      // Add other fields as needed
    },
  ],
});

export default mongoose.model("Order", OrderSchema);
