import { Product } from "../models/Product.models.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const Lubricants = [
  {
    name: "HP DIESELINO 15W-40T",
    description:
      "HP DIESELINO 15W 40 T provides optimum protection for control of corrosive wear, low and high temperature stability, soot handling properties, piston deposit control.",
    price: 10000,
    image:
      "https://s3.ap-south-1.amazonaws.com/assets.hplubricants/s3fs-public/hp-dieselino-15w-40t.png",
    quantity: "20 Litre",
  },
  {
    name: "HP MILCY TURBO 15W-40",
    description: "Premium Quality Multi-grade Diesel Engine Oil.",
    price: 1000,
    image:
      "https://s3.ap-south-1.amazonaws.com/assets.hplubricants/s3fs-public/Milcy%20Turbo%205%20LTr.jpg",
    quantity: "5 Litre",
  },
  {
    name: "HP AUTO SHAKTI 20W-50",
    description: "Superior CNG/LPG Autorickshaw Engine Oil.",
    price: 250,
    image:
      "https://s3.ap-south-1.amazonaws.com/assets.hplubricants/s3fs-public/Auto%20Shakti%20466x382_0.jpg",
    quantity: "1 Litre",
  },
  {
    name: "HP LAAL GHODA 20W-40",
    description: "HP LAAL GHODA 20W 40 is a multigrade diesel engine oil.",
    price: 1200,
    image:
      "https://s3.ap-south-1.amazonaws.com/assets.hplubricants/s3fs-public/laal-ghoda-5-ltr.jpg",
    quantity: "5 Litre",
  },
  {
    name: "HP RACER 15W-50",
    description: "Premium Quality Motor Cycle Engine Oil for Modern Bikes.",
    price: 720,
    image:
      "https://s3.ap-south-1.amazonaws.com/assets.hplubricants/s3fs-public/Racer%2015W-50%202.5%20Ltr.jpg",
    quantity: "2.5 Litre",
  },
  {
    name: "HP RACER GEN6",
    description:
      "HP RACER GEN6 grades are super premium quality motorcycle engine oils made to cater to the highly demanding lubrication requirements of modern 4-Stroke geared bikes.",
    price: 250,
    image:
      "https://s3.ap-south-1.amazonaws.com/assets.hplubricants/s3fs-public/Racer-Gen6-20w-40.jpg",
    quantity: "900 ml",
  },
  {
    name: "HP RACER PRO 10W 30",
    description: "Super Premium Quality Motorcycle Engine Oil.",
    price: 270,
    image:
      "https://s3.ap-south-1.amazonaws.com/assets.hplubricants/s3fs-public/Black-Racer-Pro-10W30.jpg",
    quantity: "1 Litre",
  },
  {
    name: "HP RACER PRO 20W 40",
    description:
      "HP RACER GEN6 grades are super premium quality motorcycle engine oils made to cater to the highly demanding lubrication requirements of modern 4-Stroke geared bikes.",
    price: 280,
    image:
      "https://s3.ap-south-1.amazonaws.com/assets.hplubricants/s3fs-public/Black-Racer-Pro-20W40.jpg",
    quantity: "1 Litre",
  },
  {
    name: "HP RACER SKUTEX",
    description: "Premium Quality Oil for Modern 4-stroke Gearless Scooters.",
    price: 220,
    image:
      "https://s3.ap-south-1.amazonaws.com/assets.hplubricants/s3fs-public/Racer%20Skutex_10W-30_800ml_2018_367x301.png",
    quantity: "800 ml",
  },
  {
    name: "HP RACER SKUTEX PRO 5W-30",
    description: "Premium Quality Engine Oil for Modern Scooters.",
    price: 210,
    image:
      "https://s3.ap-south-1.amazonaws.com/assets.hplubricants/s3fs-public/Racer%20Skutex%20Pro.png",
    quantity: "800 ml",
  },
];

const addProduct = async () => {
  // checking whether product's list already in db or not
  const storedProducts = await Product.find({});

  if (storedProducts.length === 0) {
    // store the product in db
    await Product.insertMany(Lubricants);
  }
};

const getSearchedLubricants = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const lubricants = await Product.aggregate([
    {
      $match: {
        name: {
          $regex: text,
          $options: "i",
        },
      },
    },
  ]);

  if (!lubricants) {
    return res
      .status(403)
      .json(new ApiResponse(403, {}, "No Matched Lubricants..."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, lubricants, "Found Matching Lubricants..."));
});

const findLubricantById = asyncHandler(async (req, res) => {
  const { lubricantID } = req.params;
  console.log(lubricantID);

  const lubricant = await Product.findOne({ _id: lubricantID });

  if (!lubricant) {
    throw new ApiError("403", "No Matching Lubricant...");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, lubricant, "Found Lubricant..."));
});
export { getSearchedLubricants, findLubricantById };

export default addProduct;
