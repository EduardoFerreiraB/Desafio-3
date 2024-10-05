import { Router } from "express";
import UserController from "../api/controllers/UserController";
import { authenticateToken } from "src/api/middleware/authMiddleware";

const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/user', userController.create);
userRoutes.post('/auth', userController.authenticate);
userRoutes.put('/user/:id', authenticateToken, userController.update);

export default userRoutes;
