import { Router } from "express";
import ReserveController from "../api/controllers/ReserveController";
import  { authenticateToken } from "../api/middleware/authMiddleware";
import { createReserveValidation } from "../api/middleware/reserveValidationMiddleware";

const reserveRoutes = Router();
const reserveController = new ReserveController();

reserveRoutes.post('/reserve', createReserveValidation, authenticateToken, reserveController.create);
reserveRoutes.get('/reserve', authenticateToken, reserveController.list);
reserveRoutes.get('/reserve/:id', authenticateToken, reserveController.findId);
reserveRoutes.put('/reserve/:id', authenticateToken, reserveController.update);
reserveRoutes.delete('/reserve/:id', authenticateToken, reserveController.delete);

export default reserveRoutes;
