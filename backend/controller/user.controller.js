import User from "../model/user.model.js";
import { errorHandler } from "../utils/error.js";

 export const deleteUser = async (req, res) => {
    console.log("Request Params:", req.params.id);
  if (!req.params.id) {
    return res.status(400).json({ msg: "User ID is required" });
  }
  if (req.user.id !== req.params.id) {
    return errorHandler(res, 403, "Forbidden", {
      msg: "You can delete only your account",
    });
  }
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if (!deleteUser) {
      return errorHandler(res, 404, "Not Found", { msg: "User not found" });
    }
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    return errorHandler(res, 500, "Internal Server Error", {
      msg: err.message,
    });
  }
};

export const getAllUsers = async(req,res) => {
  try{
    const users = await User.find().select("_id username").lean();
    res.status(200).json({
      success : true,
      message : "Users fetched successfully",
      data : users
    })
  }catch(err){
    return errorHandler(res, 500, "Internal Server Error", {
      msg: err.message,
    });
  }
}

