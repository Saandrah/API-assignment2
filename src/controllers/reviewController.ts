import { Request, Response } from "express"

import { Review } from "../models/Review"

export const fetchAllReviews = async (req: Request, res: Response) => {

    const reviews = await Review.find();

    res.json(reviews);

}