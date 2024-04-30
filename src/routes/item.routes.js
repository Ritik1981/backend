import express from "express";
import { Router } from "express";
import {
  getItemDetails,
  orderItem,
  updatePrice,
} from "../controllers/items.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const itemRouter = Router();

itemRouter.route("/getdetails").get(getItemDetails);
itemRouter.route("/updatePrice").post(verifyJWT, updatePrice);
itemRouter.route("/order").post(verifyJWT, orderItem);

export default itemRouter;
