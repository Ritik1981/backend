import { Router } from "express";
import {
  checkout,
  paymentVerification,
} from "../controllers/payment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const paymentRouter = Router();

paymentRouter.route("/checkout").post(verifyJWT, checkout);
paymentRouter.route("/validatepayment").post(paymentVerification); // mandatorily post request

export default paymentRouter;
