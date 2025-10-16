import express from 'express';
import { signup,signin,google,updateUser,logout} from '../controller/auth.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyOtp } from '../controller/auth.js';
import { forgotPassword } from '../controller/auth.js';
import { resendOtp } from '../controller/auth.js';
import { resetPassword } from '../controller/auth.js';


const router = express.Router();

router.post('/signup',signup);
router.post('/verify-otp',verifyOtp);
router.post('/resend-otp',resendOtp);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);


router.post('/signin',signin);
router.post("/google",google)
router.put('/update/:id',verifyToken,updateUser);
router.post('/logout',logout);

export default router; 