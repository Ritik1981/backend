import mongoose from "mongoose";
import addProduct from "../controllers/product.controllers.js";
import addItems from "../controllers/items.controllers.js";
const DB_NAME = "PUMP";
const connectDB = async function () {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_URI}/${DB_NAME}`
    );
    console.log("DATABASE SUCCESSFULLY CONNECTED.");
    console.log("DB HOST: ", connectionInstance.connection.host);
    addProduct();
    addItems();
  } catch (error) {
    console.log("Error Connecting Database...: ", error);
  }
};

export default connectDB;
