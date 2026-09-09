// Author(s): Alma Isaksson
import express from "express";
import { userController } from "../controllers/userController";

const router = express.Router();

router.get("/", userController.fetchAllUsers);
router.get("/:id", userController.fetchUser);

export default router;