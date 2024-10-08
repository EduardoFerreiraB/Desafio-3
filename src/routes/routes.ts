import { Router } from "express";
import carRoutes from "./CarRoutes";
import userRoutes from "./UserRoutes";
import reserveRoutes from "./ReserveRoutes";

const routes = Router();

routes.use('/v1', carRoutes);
routes.use('/v1', userRoutes);
routes.use('/v1', reserveRoutes);
export default routes;
