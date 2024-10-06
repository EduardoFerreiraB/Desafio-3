import * as dotenv from 'dotenv';
import express from "express";
import { AppDataSource } from "./database/data-source";
import routes from "./routes/routes";
import { errors } from "celebrate";

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello Worlds");
});

app.use(routes);

app.use(errors());

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

AppDataSource.initialize()
    .then(() => {
        console.log("Database inicializada");
    })
    .catch((error) => console.log(error));

export default app;
