// we will make different controllers for paid orders and unpaid orders
import asyncHandler from "../utils/AsyncHandler.js";
import { payment_id } from "./payment.controllers.js";
import { Order } from "../models/Order.models.js";
import mongoose from "mongoose";
import ApiResponse from "../utils/ApiResponse.js";

const getUserOrders = asyncHandler(async (req, res) => {
  // make this route protected, i.e., make use of verifyJWT

  const orders = await Order.find({ owner: req.user.fullName });
  //   console.log(orders);

  return res
    .status(201)
    .json(new ApiResponse(201, orders, "Fetched Successfully..."));
});

export { getUserOrders };
