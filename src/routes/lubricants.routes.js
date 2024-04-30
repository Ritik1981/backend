import express from "express";
import {
  findLubricantById,
  getSearchedLubricants,
} from "../controllers/product.controllers.js";

const lubricantRouter = express.Router();

lubricantRouter.route("/searchedLubricants").post(getSearchedLubricants);
lubricantRouter.route("/lubricant/:lubricantID").get(findLubricantById);

export default lubricantRouter;
