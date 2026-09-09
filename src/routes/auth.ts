// Author(s): Alma Isaksson
import express from 'express'
import { authController } from '../controllers/authController'
import { verifyToken } from '../middleware/verifyToken';

const router = express.Router()

router.get("/check", verifyToken, authController.checkAuthentication);
router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/logout', authController.logout)

export default router