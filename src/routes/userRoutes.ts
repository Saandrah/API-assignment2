import express from "express";
import { userController } from "../controllers/userController";

const router = express.Router();

// Routers
router.get("/check", userController.checkAuthentication);
router.post("/signin", userController.signIn);
router.post("/signout", userController.signOut);
router.post("/register", userController.register);

export default router;