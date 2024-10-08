import { NextFunction, Request, Response } from 'express';
import CarServices from "../services/CarServices";
import { BusinessError } from '../errors/AppError';

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

    public async findId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { id } = req.params;
        const carId = Number(id);
        try {
            const carService = new CarServices();

            if (isNaN(carId)) {
                throw new BusinessError("O id informado deve ser um número!")
            }

            const car = await carService.findId(carId);
            return res.status(200).json(car);
        }catch (error) {
            next(error);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { id } = req.params;
        const carId = Number(id);
        try {
            const deleteCar = new CarServices();

            if (isNaN(carId)) {
                throw new BusinessError("O id informado deve ser um número!")
            }

            await deleteCar.delete(carId);

            return res.status(204).send();
        } catch(error) {
            next(error);
        }
    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { id } = req.params;
        const { model, color, year, valuePerDay, acessories, numberOfPassengers } = req.body;
        const carId = Number(id);
        try {
            const carService = new CarServices();
            if (isNaN(carId)) {
                throw new BusinessError("O id informado deve ser um número!");
            }
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
            next(error);
        }
    }

    public async updateAcessory(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { id } = req.params;
        const { name } = req.body;
        const carId = Number(id);
        const carService = new CarServices();

        try {
            if (isNaN(carId)) {
                throw new BusinessError("O id informado deve ser um número!");
            }
            const updateCar = await carService.updateAcessory(carId, { name });
            return res.status(200).json(updateCar);
        } catch (error) {
            next(error);
        }
    }
}
