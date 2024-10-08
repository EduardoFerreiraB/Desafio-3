import { Router } from "express";
import UserController from "../api/controllers/UserController";
import  { authenticateToken } from "../api/middleware/authMiddleware";
import { createUserValidation } from "../api/middleware/userValidationMiddleware";
import { updateUserValidation } from "../api/middleware/userUpdateValidationMiddleware";

const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/user', createUserValidation ,userController.create);
userRoutes.post('/auth', userController.authenticate);
userRoutes.put('/user/:id', updateUserValidation, authenticateToken, userController.update);
userRoutes.get('/user/:id', authenticateToken, userController.findId);
userRoutes.delete('/user/:id', authenticateToken, userController.delete);

export default userRoutes;
