import mongoose from "mongoose";

// this is schema for online paymnet only
const paymentSchema = new mongoose.Schema(
  {
    payment_id: {
      type: String,
      required: true,
    },
    order_id: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
