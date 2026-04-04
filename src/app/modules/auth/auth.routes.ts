import express from 'express';
import { authController } from './auth.controller';
import { auth } from '../../middleWares/auth';
import { UserRole } from '../../../../prisma/generated/prisma';
const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/refreshToken',auth(UserRole.ADMIN, UserRole.MANAGER), authController.refreshToken);
router.post('/change-password',auth(UserRole.ADMIN, UserRole.MANAGER), authController.changePassword);
router.post('/forgot-password',auth(UserRole.ADMIN, UserRole.MANAGER), authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export const authRoutes = router;

