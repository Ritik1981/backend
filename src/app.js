import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import orderRouter from "./routes/order.routes.js";
import lubricantRouter from "./routes/lubricants.routes.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.urlencoded({ limit: "100kb", extended: true }));

app.use(express.json({ limit: "100kb" }));

app.use(express.static("public"));

app.use(cookieParser());

app.use("/users", userRouter);
app.use("/items", itemRouter);
app.use("/api", paymentRouter);
app.use("/orders", orderRouter);
app.use("/lubricants", lubricantRouter);

export default app;
