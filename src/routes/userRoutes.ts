// Author(s): Alma Isaksson
import express from "express";
import { userController } from "../controllers/userController";
import { checkAdmin } from "../middleware/checkAdmin";

const router = express.Router();

router.get("/", userController.fetchAllUsers);
router.get("/:id", userController.fetchUser);
router.patch("/:id", checkAdmin, userController.updateUser);
router.delete("/:id", checkAdmin, userController.deleteUser);

export default router;