import dotenv from "dotenv";
import connectDB from "./db/connectdb.js";
import app from "./app.js";
import Razorpay from "razorpay";

dotenv.config({
  path: "./env",
});

export const instance = new Razorpay({
  key_id: "rzp_test_3P2vvfMhcYsSzc",
  key_secret: "sl3ncBiZMY8G1W9uNQFXvWJF",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server Listening at: ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
