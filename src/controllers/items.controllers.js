import { Item } from "../models/Item.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { Order } from "../models/Order.models.js";
const Items = [
  {
    name: "Petrol",
    price: 98,
  },
  {
    name: "Diesel",
    price: 93,
  },
];
const addItems = async () => {
  const storedItems = await Item.find({});
  if (storedItems.length === 0) {
    // add the items
    await Item.insertMany(Items);
  }
};

const getItemDetails = asyncHandler(async (req, res) => {
  const items = await Item.find({});

  if (!items) {
    throw new ApiError(403, "Items not found...");
  }

  // console.log(items);

  return res.status(200).json(new ApiResponse(201, items, "Fetched..."));
});

const updatePrice = asyncHandler(async (req, res) => {
  // make it protected route
  // since only admin can chnge it's pricing
  // so check for admin
  const user = req.user;
  if (user.contact !== 8409297949) {
    throw new ApiError("401", "Not an Admin...");
  }
  const { price, product } = req.body;
  if (!(price || product)) {
    throw new ApiError("406", "Product and Price are required...");
  }

  const productToUpdate = await Item.findOne({ name: product });
  if (!productToUpdate) {
    throw new ApiError("404", "Bad Request...");
  }

  const updatedProduct = await productToUpdate.updateOne({ price: price });

  return res
    .status(201)
    .json(new ApiResponse(201, updatedProduct, "Successfully Updated..."));
});

const orderItem = asyncHandler(async (req, res) => {
  const { price, product, quantity1 } = req.body;

  if (!(price || product || quantity)) {
    throw new ApiError("403", "Invalid Request...");
  }

  let randomString = "";
  const arr = [0, 1, 2, 3, 4, 5];

  for (let i = 0; i < arr.length; i++) {
    let num = Math.floor(Math.random() * (5 - 0) + 0);
    randomString += arr[num];
  }
  const orderedItem = await Order.create({
    product,
    owner: req.user.fullName,
    paymentSuccess: false,
    payment_id: randomString,
    address: req.user.address,
    quantity: quantity1,
    amount: price,
  });
  if (!orderedItem) {
    throw new ApiError(501, "Internal Error while Ordering item...");
  }
  // add twilio service here
  client.messages.create({
    body: `Received order: ${product} - ${quantity1} from ${user._id} with payment ID: ${payment_id}.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: "+918409297949",
  });
  return res
    .status(201)
    .json(new ApiResponse(201, orderedItem, "Successfully Ordered"));
});
export { getItemDetails, updatePrice, orderItem };
export default addItems;
