import Listing from "../model/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const searchProperties = async (req, res) => {
  const { q, type } = req.query; // Read `type`
  let filter = {};

  if (q?.trim()) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { address: { $regex: q, $options: "i" } },
    ];
  }

  if (type && type !== "all") {
    filter.type = type; // Correct field
  }

  try {
    const result = await Listing.find(filter).limit(20);
    res.json(result);
  } catch (err) {
    return errorHandler(res, 500, "Internal Server Error");
  }
};

export const getPropertiesByCity = async (req, res) => {
  try {
    const cities = await Listing.aggregate([
      {
        $addFields: {
          city: {
            $trim: {
              input: {
                $arrayElemAt: [{ $split: ["$address", ","] }, -1],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 },
          images: { $push: "$images" },
        },
      },
    ]);

    const formatedCities = cities.map((city) => {
      const allImage = city.images.flat();
      const image = allImage.length > 0 ? allImage[0] : null;
      return {
        name: city._id || "Unknown",
        propertiesCount: city.count,
        image: image,
      };
    });

    res.json(formatedCities);
  } catch (err) {
    return errorHandler(res, 500, "Internal Server Error");
  }
};

export const getBestDeals = async(req,res) => {
 try{
  const bestDeals =  await Listing.find({offer:true}).sort({createdAt:-1}).limit(10);
  res.status(200).json({
    success : true,
    message : "Best deals fetched successfully",
    data : bestDeals
  })
 }catch(err){
  return errorHandler(res, 500, "Internal Server Error");
 }
}
