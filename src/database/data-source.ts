import "reflect-metadata"
import { DataSource } from "typeorm"
import Car from "../api/models/CarModel"
import Acessory from "../api/models/AcessoryModel"
import { CreateCar1727973131333 } from "./migrations/1727973131333-createCar"
import { CreateAcessory1727973150757 } from "./migrations/1727973150757-createAcessory"
import { CreateUser1727977021359 } from "./migrations/1727977021359-createUser"
import { CreateReserve1727977030853 } from "./migrations/1727977030853-createReserve"
import Users from "../api/models/UserModel"
import Reserve from "../api/models/ReserveModel"

export const AppDataSource = new DataSource ({
    type: "sqlite",
    database: "desafio3.sqlite",
    synchronize: true,
    logging: false,
    entities: [Car, Acessory, Users, Reserve],
    migrations: [CreateCar1727973131333, CreateAcessory1727973150757, CreateUser1727977021359, CreateReserve1727977030853],
    subscribers: [],
})