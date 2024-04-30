import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { User } from "../models/user.models.js";

const generateTokens = async (userid) => {
  try {
    // console.log(userid);
    const user = await User.findById(userid);
    console.log("Generating Tokens...");
    // console.log(user);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // generated accessToken and refreshToken:
    // console.log(accessToken, "\n", refreshToken);

    // saving refreshToken in db
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log("Error generating Tokens...");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, contact, password, address } = req.body;

  if (!(fullName || contact || password || address)) {
    throw new ApiError(409, "All Fields are required...");
  }

  // finding whether user already exists or not

  const doesUserExist = await User.findOne({ contact });

  if (doesUserExist) {
    throw new ApiError(406, "User already exists...");
  }

  const user = await User.create({
    fullName,
    contact,
    address,
    password,
  });

  const registeredUser = await User.findById(user._id).select(
    " -password -refreshToken"
  );

  if (!registeredUser) {
    throw new ApiError(501, "Error Registering User...");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, registeredUser, "User Created Successfully..."));
});

const loginUser = asyncHandler(async (req, res) => {
  // we have to add login functionality both using password as well as OTP(mobile).

  const { contact, password } = req.body;

  if (!contact) {
    throw new ApiError(403, "Phone is Required...");
  }

  // finding user

  const user = await User.findOne({ contact });

  if (!user) {
    throw new ApiError(404, "User Not Found...");
  }

  // matching password

  const isPassCorrect = user.isPassWordCorrect(password);

  if (!isPassCorrect) {
    throw new ApiError(409, "Unauthorized Access not allowed...");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    " -password -refreshToken "
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { loggedInUser, accessToken },
        "Logged-In Successfully..."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // user must be logged-in in order to log-out
  // control this functionality via frontend
  // after making some changes in database navigate user to home page and make logged-in set to false

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // meaning setting refreshToken = null or just clearing the refreshToken
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully..."));
});

const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    " -password -refreshToken "
  );

  if (!user) {
    throw new ApiError(501, "Error Finding user Details");
  }

  // const returnUserData = user.select(" -password -refreshToken ");

  return res
    .status(200)
    .json(new ApiResponse(201, user, "User details Fetched Successfully..."));
});

export { registerUser, loginUser, logoutUser, getUserDetails };
