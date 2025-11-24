import express from 'express';
import { deleteUser, getAllUsers } from '../controller/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get("/get-user",getAllUsers);
router.delete("/delete/:id",verifyToken,deleteUser);


export default router;
