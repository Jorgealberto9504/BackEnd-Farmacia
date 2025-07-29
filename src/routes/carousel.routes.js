import express from "express";
import passport from "../config/passport.config.js";
import { soloAdmin } from "../middlewares/auth.middleware.js";
import { getCarouselImages, addCarouselImage, deleteCarouselImage } from "../controllers/carousel.controller.js";
import { uploadCarousel } from "../config/multer.config.js";

const router = express.Router();

router.get("/", getCarouselImages);
router.post("/", passport.authenticate("jwt", { session: false }), soloAdmin, uploadCarousel.single("imagen"), addCarouselImage);
router.delete("/:id", passport.authenticate("jwt", { session: false }), soloAdmin, deleteCarouselImage);

export default router;