import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserOrders } from "../controllers/order.controllers.js";

const orderRouter = express.Router();
orderRouter.route("/getorders").get(verifyJWT, getUserOrders);

export default orderRouter;
