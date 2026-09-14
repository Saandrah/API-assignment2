import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    name: { 
        type: String, 
        required: true },
    content : { 
        type: String, 
        required: true },
    rating: { 
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    review_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true
}

});

export const Review = mongoose.model("Review", reviewSchema);

