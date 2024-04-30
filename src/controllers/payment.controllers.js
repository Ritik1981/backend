import asyncHandler from "../utils/AsyncHandler.js";
import { instance } from "../index.js";
import ApiResponse from "../utils/ApiResponse.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.models.js";
import ApiError from "../utils/ApiError.js";
import { Order } from "../models/Order.models.js";
import twilio from "twilio";

export const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export let payment_id;
let product_name;
let price;
let ordered_quantity;
let user;
export const checkout = asyncHandler(async (req, res) => {
  const { product, amount, quantity } = req.body;
  user = req.user;
  product_name = product;
  price = amount;
  ordered_quantity = quantity;

  const options = {
    amount: req.body.amount * 100, //50000, // 50000 // equals to 500
    currency: "INR",
  };
  let order;
  try {
    order = await instance.orders.create(options);
    console.log(order);
  } catch (error) {
    console.log("Error: ", error);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order successfully created..."));
});

export const paymentVerification = asyncHandler(async (req, res) => {
  console.log(req.body);

  // if user payment is successful then paymnet_id + order_id === razorpay_signature
  // let's verify
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  payment_id = razorpay_payment_id;
  // const body = razorpay_payment_id + "|" + razorpay_order_id;

  const expectedSignature = crypto
    .createHmac("sha256", "sl3ncBiZMY8G1W9uNQFXvWJF")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  console.log("Signature received: ", razorpay_signature);
  console.log("Signature generated: ", expectedSignature);

  if (expectedSignature === razorpay_signature) {
    // save payment to database
    await Payment.create({
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature,
    });

    // we will write order controllers here for online-payment:
    // save order to database

    await Order.create({
      product: product_name,
      owner: user.fullName,
      paymentSuccess: true,
      payment_id,
      address: user.address,
      quantity: ordered_quantity,
      amount: price,
    });

    // add twilio service here
    client.messages.create({
      body: `Received prepaid order: ${product_name} - ${ordered_quantity} from ${user._id} with payment ID: ${payment_id}.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+918409297949",
    });

    // return res.status(201).json(new ApiResponse(201, {}, "Success.."));
  } else {
    throw new ApiError(501, "Payment Validation Failed...");
  }
});
