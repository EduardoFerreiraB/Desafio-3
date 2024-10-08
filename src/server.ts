import * as dotenv from 'dotenv';
import express from "express";
import { AppDataSource } from "./database/data-source";
import routes from "./routes/routes";
import { errors } from "celebrate";
import { handleErrors } from './api/errors/handleErrors';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();

const swaggerDoc = YAML.load('./openapi.yaml');

app.use(express.json());

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(routes);

app.use(errors());
app.use(handleErrors);

if (process.env.NODE_ENV !== 'test') {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}

AppDataSource.initialize()
    .then(() => {
        console.log("Database inicializada");
    })
    .catch((error) => console.log(error));

export default app;
