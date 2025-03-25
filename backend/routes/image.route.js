const express = require("express");
const { uploadCarouselImages } = require("../controller/image.controller");
const {
  getAllImages,
  getImageById,
} = require("../controllers/cloudinaryController");
const router = express.Router();
router.post(
  "/upload-carousel",
  upload.array("images", 10),
  uploadCarouselImages
);

router.get("/images", getAllImages);
router.get("/images/:id", getImageById);
