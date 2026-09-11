import express from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController";
import { verifyToken } from "../middleware/verifyToken";
import { checkAdmin } from "../middleware/checkAdmin";

const router = express.Router();

// Routers
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", verifyToken, checkAdmin, createBook);
router.patch("/:id", verifyToken, checkAdmin, updateBook);
router.delete("/:id", verifyToken, checkAdmin, deleteBook);

export default router;
