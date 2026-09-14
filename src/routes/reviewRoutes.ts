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
import { verifyToken } from "../middleware/verifyToken";

router.get("/", fetchAllReviews);
router.get("/:id", fetchReviewById);
router.post("/", createReview);
router.patch("/:id", verifyToken, updateReview);
router.delete("/:id", verifyToken, deleteReview);

export default router;


