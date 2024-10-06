import { Request, Response } from 'express';
import CarServices from "../services/CarServices";

interface CarQuery {
    model?: string;
    color?: string;
    year?: string | number;
    valuePerDay?: string | number;
    numberOfPassengers?: string | number;
    limit?: string | number;
    offset?: string | number;
}


export default class CarController {
    public async create(req: Request, res: Response): Promise<Response> {
        const carService = new CarServices();

        const { model, color, year, valuePerDay, acessories, numberOfPassengers } = req.body;

        const car = await carService.create({
            model, color, year, valuePerDay, acessories, numberOfPassengers
        });

        return res.status(201).json(car);
    }

    public async list(req: Request, res: Response): Promise<Response> {
        const carService = new CarServices();

        const { model, color, year, valuePerDay, numberOfPassengers, limit, offset } = req.query as CarQuery;

        try {
            const cars = await carService.list({
                model,
                color,
                year: year ? Number(year) : undefined,
                valuePerDay: valuePerDay ? Number(valuePerDay) : undefined,
                numberOfPassengers: numberOfPassengers ? Number(numberOfPassengers) : undefined,
                limit: limit ? Number(limit) : undefined,
                offset: offset ? Number(offset) : undefined,
            });

            return res.status(200).json(cars);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({message: error.message});
            }

            return res.status(500).json({message: "Internal server error"});
        }
    }

    public async findId(req: Request, res: Response): Promise<Response> {
        const carService = new CarServices();
        const { id } = req.params;

        try {
            const car = await carService.findId(Number(id));
            return res.status(200).json(car);
        }catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({message: error.message});
            }

            return res.status(500).json({message: "Internal server error"});
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const deleteCar = new CarServices();

        await deleteCar.delete(Number(id));

        return res.status(204).send();
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { model, color, year, valuePerDay, acessories, numberOfPassengers } = req.body;
        const carId = Number(id);
        try {
            const carService = new CarServices();
            const updateCar = await carService.update(carId, {
                model,
                color,
                year,
                valuePerDay,
                acessories,
                numberOfPassengers,
            });

            return res.status(200).json(updateCar);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({message: error.message});
            }

            return res.status(500).json({message: "Internal server error"});
        }
    }

    public async updateAcessory(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { name } = req.body;
        const carId = Number(id);
        const carService = new CarServices();

        try {
            const updateCar = await carService.updateAcessory(carId, { name });
            return res.status(200).json(updateCar);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({message: error.message});
            }

            return res.status(500).json({message: "Internal server error"});
        }
    }
}
