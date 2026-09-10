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
//Create a new book including title, description, author, genres, image, published_year
//Validation for required fields
// If any of the required fields are missing, return an error
//genres should be an array of strings
//Use split, map and trim to convert genres string to array of strings for user friendly input

export const createBook = async (req: Request, res: Response) => {
  const { title, description, author, genres, image, published_year } =
    req.body;
  try {
    if (
      !title ||
      !description ||
      !author ||
      !genres ||
      !image ||
      !published_year
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const genresArray = Array.isArray(genres)
      ? genres
      : genres.split(",").map((genre: string) => genre.trim());

    if (!genresArray || genresArray.length === 0) {
      return res
        .status(400)
        .json({ error: "Genres must contain at least one value" });
    }
    const book = new Book({
      title,
      description,
      author,
      genres: genresArray,
      image,
      published_year,
    });

    await book.save();
    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error - failed to create book";
    res.status(500).json({ error: message });
  }
};

//-----------------------------------
// PATCH - UPDATE BOOK
//-----------------------------------

//-----------------------------------
// DELETE - DELETE BOOK
//-----------------------------------

//-----------------------------------
// EXPORTS
//-----------------------------------
