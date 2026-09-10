import express from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
} from "../controllers/bookController";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

// Routers
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", verifyToken, createBook);

export default router;
