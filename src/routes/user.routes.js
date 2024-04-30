import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").delete(verifyJWT, logoutUser);
userRouter.route("/getuserdetails").get(verifyJWT, getUserDetails); // send token via cookie or headers to backend
export default userRouter;
