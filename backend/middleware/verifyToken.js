import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';  // Reuse your error handler

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("token>>>>>>>>>>>>>",token)
  if (!token) {
    return errorHandler(res, 401, 'Unauthorized', { msg: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return errorHandler(res, 401, 'Unauthorized', { msg: 'Invalid token' });
    }
    req.user = user;  // Attach decoded user to req
    next();
  });
};