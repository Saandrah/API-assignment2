//-----------------------------------
// IMPORTS
//-----------------------------------

import { Request, Response } from "express";
import { Book } from "../models/Book";
//import { Review } from "../models/Review";

//-----------------------------------
// GET - GET ALL BOOKS
//-----------------------------------
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error - failed to fetch books";
    res.status(500).json({ error: message });
  }
};

//-----------------------------------
// GET - GET BOOK BY ID + REVIEWS
//-----------------------------------
//Get book by ID and connect to reviews collection to get all reviews for that book

export const getBookById = async (req: Request, res: Response) => {
  const bookId = req.params.id;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    //TO ADD REVIEWS LATER WHEN CONNECTED
    /*const reviews = await Review.find({ book: bookId });
    res.json({ book, reviews });*/

    res.json(book);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error - failed to fetch book";
    res.status(500).json({ error: message });
  }
};

//-----------------------------------
// POST - CREATE BOOK
//-----------------------------------

//-----------------------------------
// PATCH - UPDATE BOOK
//-----------------------------------

//-----------------------------------
// DELETE - DELETE BOOK
//-----------------------------------

//-----------------------------------
// EXPORTS
//-----------------------------------
