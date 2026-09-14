import { Request, Response } from "express"

import { Review } from "../models/Review"
import mongoose from "mongoose";

// -----------------------------------
// GET - GET ALL REVIEWS
// 

export const fetchAllReviews = async (req: Request, res: Response) => {

    const reviews = await Review.find();

    res.json(reviews);

}

// -----------------------------------
// GET - GET REVIEW BY ID
// -----------------------------------
export const fetchReviewById = async (req: Request, res: Response) => {
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);

    if (!review) {
        return res.status(404).json({ error: "Review not found" });
    }

    res.json(review);

}

// -----------------------------------
// POST - CREATE REVIEW
// -----------------------------------


export const createReview = async (req: Request, res: Response) => {
    try {
        
        const { name, content, rating, book_id } = req.body;

        const review = new Review({
            name,
            content,
            rating,
            review_id: new mongoose.Types.ObjectId(),
           book_id
        });

        await review.save();

    res.status(201).json(review);

    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Unknown error - failed to create review";

        res.status(500).json({ error: message });
    }
};

// -----------------------------------
// PATCH - UPDATE REVIEW
// -----------------------------------


export const updateReview = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.id;
        const { name, content, rating } = req.body;

        const review = await Review.findByIdAndUpdate(
        reviewId,
        { name, content, rating },
        { new: true }
        );

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        res.json({
            message: "Review updated successfully",
            review
        });


    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Unknown error - failed to update review";

        res.status(500).json({ error: message });
    }
};

// -----------------------------------
// DELETE - DELETE REVIEW
// -----------------------------------

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.id;
        const review = await Review.findByIdAndDelete(reviewId);
        
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.json({
            message: "Review deleted successfully",
            review
        });

    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Unknown error - failed to delete review";

        res.status(500).json({ error: message });
    }
};


  

