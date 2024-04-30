import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    product: {
      type: String,
    },
    lubricant: {
      type: String,
    },
    owner: {
      type: String,
      required: true,
    },
    paymentSuccess: {
      type: Boolean,
      required: true,
    },
    payment_id: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);

// as soon as paymnet is successful
