//-----------------------------------
// IMPORTS
//-----------------------------------

import { Request, Response } from "express";
import { Book } from "../models/Book";
import { Review } from "../models/Review";

//-----------------------------------
// REUSABLE CONTROLLER FUNCTIONS
//-----------------------------------
//A function to handle array of strings for genres, to be used in createBook and updateBook
const handleGenresArray = (genres: string | string[]): string[] => {
  if (Array.isArray(genres)) {
    return genres;
  }
  if (typeof genres === "string") {
    return genres.split(",").map((genre: string) => genre.trim());
  }
  return [];
};

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
 //REVIEWS 
    const reviews = await Review.find({ book_id: bookId });
    res.json({ book, reviews });

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

    const genresArray = handleGenresArray(genres);

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
//Update a book by ID including title, description, author, genres, image, published_year, all fields are optional, if not provided, the existing value will be kept

export const updateBook = async (req: Request, res: Response) => {
  const bookId = req.params.id;
  const { title, description, author, genres, image, published_year } =
    req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (title !== undefined) book.title = title;
    if (description !== undefined) book.description = description;
    if (author !== undefined) book.author = author;
    if (genres !== undefined) {
      book.genres = handleGenresArray(genres);
    }
    if (image !== undefined) book.image = image;
    if (published_year !== undefined) book.published_year = published_year;

    await book.save();
    res.json({
      message: "Book updated successfully",
      book,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error - failed to update book";
    res.status(500).json({ error: message });
  }
};

//-----------------------------------
// DELETE - DELETE BOOK
//-----------------------------------

//TO DO/ADD!!!!!!: When deleting a book, also delete all reviews for that book in the reviews collection

export const deleteBook = async (req: Request, res: Response) => {
  const bookId = req.params.id;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Delete all reviews for this book
    //await Review.deleteMany({ book: bookId });

    await book.deleteOne();

    res.json({
      message: "Book deleted successfully",
      bookId: bookId,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error - failed to delete book";
    res.status(500).json({ error: message });
  }
};
