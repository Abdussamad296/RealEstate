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


export const getMonthlyStats = async (req, res) => {
  try {
    const stats = await Listing.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, 
          total: { $sum: 1 },             
          sale: {
            $sum: {
              $cond: [{ $eq: ["$type", "sale"] }, 1, 0],
            },
          },
          rent: {
            $sum: {
              $cond: [{ $eq: ["$type", "rent"] }, 1, 0], 
            },
          },
          offer: {
            $sum: {
              $cond: [{ $eq: ["$offer", true] }, 1, 0], 
            },
          },
        },
      },
      { $sort: { _id: 1 } }, 
    ]);

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const formattedStats = stats.map((item) => ({
      month: months[item._id - 1], 
      total: item.total,
      sale: item.sale,
      rent: item.rent,
      offer: item.offer,
    }));

    res.status(200).json({
      success: true,
      message: "Monthly stats fetched successfully",
      data: formattedStats,
    });

  } catch (err) {
    return errorHandler(res, 500, "Internal Server Error", {
      msg: err.message,
    });
  }
};

