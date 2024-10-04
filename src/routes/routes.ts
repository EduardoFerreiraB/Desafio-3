import { Router } from "express";
import carRoutes from "./CarRoutes";

const routes = Router();

routes.use('/v1', carRoutes);
export default routes;
