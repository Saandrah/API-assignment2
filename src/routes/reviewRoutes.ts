import express from "express";
const router = express.Router();

// Routers
import {
    fetchAllReviews,
    fetchReviewById,
    createReview,
    updateReview,
    deleteReview
} from "../controllers/reviewController";

router.get("/", fetchAllReviews);
router.get("/:id", fetchReviewById);
router.post("/", createReview);
router.patch("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;


