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
            return res.status(404).json({ message: 'No cars found matching the specified criteria.'});
            console.log(error);
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const deleteCar = new CarServices();

        await deleteCar.delete(Number(id));

        return res.status(204).send();
    }
}
