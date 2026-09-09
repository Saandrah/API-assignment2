//-----------------------------------
// IMPORTS
//-----------------------------------

import mongoose from "mongoose";
const Schema = mongoose.Schema;

//-----------------------------------
// BOOK SCHEMA
//-----------------------------------
//Book Schema title: String, description: String, author: String, genres: Array, image: String,published_year: Number

const bookSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  genres: { type: [String], required: true },
  image: { type: String, required: true },
  published_year: { type: Number, required: true },
});

//-----------------------------------
// BOOK MODEL EXPORT
//-----------------------------------
export const Book = mongoose.model("Book", bookSchema);
