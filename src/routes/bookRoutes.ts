import express from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
} from "../controllers/bookController";
import { verifyToken } from "../middleware/verifyToken";
import { checkAdmin } from "../middleware/checkAdmin";

const router = express.Router();

// Routers
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", verifyToken, createBook);
router.patch("/:id", checkAdmin, updateBook);

export default router;
