import express from "express";
import { userController } from "../controllers/userController";
import { verifyToken } from "../middleware/verifyToken";
import { checkAdmin } from "../middleware/checkAdmin";

const router = express.Router();

router.get("/check", verifyToken, userController.authentication.checkAuthentication);
router.post("/sign-in", userController.authentication.signIn);
router.post("/sign-out", userController.authentication.signOut);
router.post("/register", userController.authentication.register);
router.get("/fetch-all", checkAdmin, userController.management.fetchAllUsers);

export default router;