import Listing from "../model/listing.model.js";
import { errorHandler, serverHandlerError } from "../utils/error.js";
import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
import User from "../model/user.model.js";

const uploadDir = path.join(process.cwd(), "Uploads", "listings");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${nanoid()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, and .png files are allowed"), false);
    }
  },
}).array("images", 6);

export const createListing = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return errorHandler(res, 400, "File Upload Error", { msg: err.message });
    }

    try {
      const {
        name,
        description,
        address,
        regularPrice,
        discountedPrice,
        bedrooms,
        bathrooms,
        furnished,
        offer,
        parking,
        type,
      } = req.body;

      if (
        !name ||
        !description ||
        !address ||
        !regularPrice ||
        !bedrooms ||
        !bathrooms ||
        furnished === undefined ||
        offer === undefined ||
        parking === undefined ||
        !type ||
        !req.files ||
        req.files.length === 0
      ) {
        return errorHandler(res, 400, "Validation Error", {
          msg: "All fields are required and must be valid.",
        });
      }

      const parsedRegularPrice = parseFloat(regularPrice);
      const parsedDiscountedPrice = discountedPrice
        ? parseFloat(discountedPrice)
        : 0;
      const parsedBedrooms = parseInt(bedrooms);
      const parsedBathrooms = parseInt(bathrooms);

      if (
        isNaN(parsedRegularPrice) ||
        parsedRegularPrice < 0 ||
        isNaN(parsedBedrooms) ||
        parsedBedrooms < 1 ||
        parsedBedrooms > 10 ||
        isNaN(parsedBathrooms) ||
        parsedBathrooms < 1 ||
        parsedBathrooms > 10 ||
        (discountedPrice && isNaN(parsedDiscountedPrice)) ||
        parsedDiscountedPrice < 0
      ) {
        return errorHandler(res, 400, "Validation Error", {
          msg: "Invalid numeric values for price, bedrooms, or bathrooms.",
        });
      }

      if (
        offer === "true" &&
        (parsedDiscountedPrice >= parsedRegularPrice ||
          parsedDiscountedPrice <= 0)
      ) {
        return errorHandler(res, 400, "Validation Error", {
          msg: "Discounted price must be less than regular price and greater than 0.",
        });
      }

      const allowedTypes = ["rent", "sale"];
      if (!allowedTypes.includes(type)) {
        return errorHandler(res, 400, "Validation Error", {
          msg: `Type must be one of: ${allowedTypes.join(", ")}`,
        });
      }

      if (
        name.trim().length < 3 ||
        name.trim().length > 100 ||
        description.trim().length < 10 ||
        description.trim().length > 1000 ||
        address.trim().length < 5 ||
        address.trim().length > 200
      ) {
        return errorHandler(res, 400, "Validation Error", {
          msg: "Invalid length for name (3-100), description (10-1000), or address (5-200).",
        });
      }

      const userRef = req.user?.id;
      if (!userRef) {
        return errorHandler(res, 401, "Unauthorized", {
          msg: "User authentication required.",
        });
      }

      const imageUrls = req.files.map(
        (file) => `/uploads/listings/${file.filename}`
      );

      const listing = await Listing.create({
        name: name.trim(),
        description: description.trim(),
        address: address.trim(),
        regularPrice: parsedRegularPrice,
        discountedPrice: offer === "true" ? parsedDiscountedPrice : 0,
        bedrooms: parsedBedrooms,
        bathrooms: parsedBathrooms,
        furnished: furnished === "true",
        offer: offer === "true",
        parking: parking === "true",
        type: type.trim(),
        images: imageUrls,
        userRef,
      });

      return res.status(201).json({
        msg: "Listing created successfully",
        data: listing,
      });
    } catch (err) {
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlink(path.join(uploadDir, file.filename), (err) => {
            if (err)
              console.error(`Failed to delete file ${file.filename}:`, err);
          });
        });
      }
      return serverHandlerError(res, err);
    }
  });
};

export const updateListing = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return errorHandler(res, 400, "File Upload Error", { msg: err.message });
    }

    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return errorHandler(res, 404, "Listing Not Found");
      }
      if (listing.userRef.toString() !== req.user.id) {
        return errorHandler(res, 401, "Unauthorized");
      }

      const {
        name,
        description,
        address,
        regularPrice,
        discountedPrice,
        bedrooms,
        bathrooms,
        furnished,
        offer,
        parking,
        type,
        existingImages: existingStr,
      } = req.body;

      let existingImages = listing.images;
      if (existingStr) {
        try {
          existingImages =
            typeof existingStr === "string"
              ? JSON.parse(existingStr)
              : existingStr;
          if (!Array.isArray(existingImages)) {
            throw new Error("existingImages must be an array");
          }
        } catch (parseErr) {
          return errorHandler(res, 400, "Validation Error", {
            msg: "Invalid existingImages format. Must be a valid JSON array.",
          });
        }
      }

      const removedImages = listing.images.filter(
        (url) => !existingImages.includes(url)
      );
      removedImages.forEach((url) => {
        const filePath = path.join(process.cwd(), url);
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Failed to delete image ${url}:`, err);
        });
      });

      const newImageUrls = req.files
        ? req.files.map((file) => `/uploads/listings/${file.filename}`)
        : [];
      const updatedImages = [...existingImages, ...newImageUrls];

      if (updatedImages.length === 0) {
        return errorHandler(res, 400, "Validation Error", {
          msg: "At least one image is required.",
        });
      }

      if (
        !name ||
        !description ||
        !address ||
        !regularPrice ||
        !bedrooms ||
        !bathrooms ||
        furnished === undefined ||
        offer === undefined ||
        parking === undefined ||
        !type
      ) {
        return errorHandler(res, 400, "Validation Error", {
          msg: "All fields are required and must be valid.",
        });
      }

      const parsedRegularPrice = parseFloat(regularPrice);
      const parsedDiscountedPrice = discountedPrice
        ? parseFloat(discountedPrice)
        : 0;
      const parsedBedrooms = parseInt(bedrooms);
      const parsedBathrooms = parseInt(bathrooms);

      if (
        isNaN(parsedRegularPrice) ||
        parsedRegularPrice < 0 ||
        isNaN(parsedBedrooms) ||
        parsedBedrooms < 1 ||
        parsedBedrooms > 10 ||
        isNaN(parsedBathrooms) ||
        parsedBathrooms < 1 ||
        parsedBathrooms > 10 ||
        (discountedPrice && isNaN(parsedDiscountedPrice)) ||
        parsedDiscountedPrice < 0
      ) {
        return errorHandler(res, 400, "Validation Error", {
          msg: "Invalid numeric values for price, bedrooms, or bathrooms.",
        });
      }

      if (
        offer === "true" &&
        (parsedDiscountedPrice >= parsedRegularPrice ||
          parsedDiscountedPrice <= 0)
      ) {
        return errorHandler(res, 400, "Validation Error", {
          msg: "Discounted price must be less than regular price and greater than 0.",
        });
      }

      const allowedTypes = ["rent", "sale"];
      if (!allowedTypes.includes(type)) {
        return errorHandler(res, 400, "Validation Error", {
          msg: `Type must be one of: ${allowedTypes.join(", ")}`,
        });
      }

      if (
        name.trim().length < 3 ||
        name.trim().length > 100 ||
        description.trim().length < 10 ||
        description.trim().length > 1000 ||
        address.trim().length < 5 ||
        address.trim().length > 200
      ) {
        return errorHandler(res, 400, "Validation Error", {
          msg: "Invalid length for name (3-100), description (10-1000), or address (5-200).",
        });
      }

      listing.name = name.trim();
      listing.description = description.trim();
      listing.address = address.trim();
      listing.regularPrice = parsedRegularPrice;
      listing.discountedPrice = offer === "true" ? parsedDiscountedPrice : 0;
      listing.bedrooms = parsedBedrooms;
      listing.bathrooms = parsedBathrooms;
      listing.furnished = furnished === "true";
      listing.offer = offer === "true";
      listing.parking = parking === "true";
      listing.type = type.trim();
      listing.images = updatedImages;

      await listing.save();

      return res.status(200).json({
        msg: "Listing updated successfully",
        data: listing,
      });
    } catch (err) {
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlink(path.join(uploadDir, file.filename), (err) => {
            if (err)
              console.error(`Failed to delete file ${file.filename}:`, err);
          });
        });
      }
      return serverHandlerError(res, err);
    }
  });
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return errorHandler(res, 404, "Listing Not Found");
    }
    if (listing.userRef.toString() !== req.user.id) {
      return errorHandler(res, 401, "Unauthorized");
    }

    listing.images.forEach((url) => {
      const filePath = path.join(process.cwd(), url);
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Failed to delete image ${url}:`, err);
      });
    });

    await Listing.deleteOne({ _id: req.params.id });

    return res.status(200).json({
      msg: "Listing deleted successfully",
    });
  } catch (err) {
    return serverHandlerError(res, err);
  }
};

export const getUserListings = async (req, res) => {
  try {
    const userRef = req.user.id || req.user._id;

    if (!userRef) {
      return errorHandler(res, 401, "Unauthorized", {
        msg: "User authentication required.",
      });
    }

    // Fetch user email
    const user = await User.findById(userRef).select("email");
    console.log("user:", user);
    if (!user) {
      return errorHandler(res, 404, "User not found");
    }

    // Fetch listings created by this user
    const listings = await Listing.find({ userRef: userRef }).sort({
      createdAt: -1,
    });

    if (listings.length === 0) {
      return errorHandler(res, 404, "No Listings Found", {
        msg: "You have not created any listings yet.",
      });
    }
    return res.status(200).json({
      msg: "Listings retrieved successfully",
      userEmail: user.email, // Include user's email
      data: listings, // Include user's listings
    });
  } catch (err) {
    console.error("Error fetching user listings:", err);
    return serverHandlerError(res, err);
  }
};

export const getRecentListings = async (req, res) => {
  try {
    const currentUserId = req.user?.id;

    const listings = await Listing.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const finalListings = await Promise.all(
      listings.map(async (listing) => {
        const user = await User.findById(listing.userRef).select(
          "email username"
        );

        const likeIds = listing.likes?.map(id => id.toString()) || [];

        return {
          ...listing,
          userEmail: user?.email || null,
          userName: user?.username || null,
          likesCount: likeIds.length,
          liked: likeIds.includes(currentUserId),
        };
      })
    );

    return res.status(200).json({
      msg: "Recent listings retrieved successfully",
      data: finalListings,
    });
  } catch (err) {
    console.error("Error fetching recent listings:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};



export const getListingById = async (req, res) => {
  try {
    // Fetch the listing by ID
    const listing = await Listing.findById(req.params.id).lean(); // use lean for plain JS object
    if (!listing) {
      return errorHandler(res, 404, "Listing Not Found");
    }

    // Fetch the user who created this listing
    const user = await User.findById(listing.userRef).select("email username");
    console.log("user:", user);
    // Merge user email into the listing
    const listingWithEmail = {
      ...listing,
      userEmail: user?.email || null,
      userName: user?.username || null,
    };

    return res.status(200).json({
      msg: "Listing retrieved successfully",
      data: listingWithEmail,
    });
  } catch (err) {
    console.error("Error fetching listing:", err);
    return serverHandlerError(res, err);
  }
};

export const toggleLike = async (req, res) => {
  try {
    const {userId} = req.body;
    const { id: listingId } = req.params;
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }
    const alreadyLiked = listing.likes.includes(userId);
    if (alreadyLiked) {
      listing.likes.pull(userId);
    } else {
      listing.likes.push(userId);
    }
    await listing.save();
    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: listing.likes.length,
    });
  } catch (err) {
    console.err(err);
    res.status(500).json({ message: "Server Error" });
  }
};
