import { Router } from "express";
import CarController  from "../api/controllers/CarController";
import { createCarValidation } from "../api/middleware/carValidationMiddleware";

const carRoutes = Router();
const carController = new CarController();

carRoutes.post('/car', createCarValidation, carController.create);

carRoutes.get('/car', carController.list);

carRoutes.delete('/car/:id', carController.delete);

export default carRoutes;