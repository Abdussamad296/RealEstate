import Listing from "../model/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const getDashboardState = async (req, res) => {
  try {
    const totalProperties = await Listing.countDocuments({});
    const totalSellingProperties = await Listing.countDocuments({
      type: "sale",
    });
    const totalRentingProperties = await Listing.countDocuments({
      type: "rent",
    });
    const offerListings = await Listing.countDocuments({ offer: true });
    res.status(200).json({
      totalProperties,
      totalSellingProperties,
      totalRentingProperties,
      offerListings,
    });
  } catch (err) {
    return errorHandler(res, 500, "Internal Server Error", {
      msg: err.message,
    });
  }
};

export const getMonthlyStats  = async(req,res)=>{
    
}
