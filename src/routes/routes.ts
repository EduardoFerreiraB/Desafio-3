import { Router } from "express";
import carRoutes from "./CarRoutes";
import userRoutes from "./UserRoutes";

const routes = Router();

routes.use('/v1', carRoutes);
routes.use('/v1', userRoutes);
export default routes;
