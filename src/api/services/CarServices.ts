import  Car  from '../models/CarModel';
import { CarDTO } from '../dtos/CarDTO';
import { AppDataSource } from '../../database/data-source';
import Acessory from '../models/AcessoryModel';
import CarRepository from '../repositories/CarRepository';
import { PaginateCarDTO } from '../dtos/PaginateCarDTO';

interface IRequest {
    model: string;
    color: string;
    year: number;
    valuePerDay: number;
    acessories?: Acessory[];
    numberOfPassengers: number;
}

interface IListCarRequest {
    model?: string;
    color?: string;
    year?: number;
    valuePerDay?: number;
    numberOfPassengers?: number;
    limit?: number;
    offset?: number;
}

export default class CarService {
    private carRepository: CarRepository;

    constructor(){
        this.carRepository = new CarRepository();
    }

    async create({ model, color, year, valuePerDay, acessories, numberOfPassengers }: IRequest): Promise<CarDTO> {
        const carRepository = AppDataSource.getRepository(Car);

        const car = carRepository.create({
            model,
            color,
            year,
            valuePerDay,
            acessories,
            numberOfPassengers,
        });

        await carRepository.save(car);

        return new CarDTO(car);
    }

    async list({ model, color, year, valuePerDay, numberOfPassengers, limit = 10, offset = 0, }:
        IListCarRequest): Promise<PaginateCarDTO> {

            const cars = await this.carRepository.list({
                model,
                color,
                year,
                valuePerDay,
                numberOfPassengers,
                limit,
                offset,
            });

            const total = await this.carRepository.count({
                model,
                color,
                year,
                valuePerDay,
                numberOfPassengers,
            });

            if (total === 0 && (model || color || year || valuePerDay || numberOfPassengers)) {
                throw new Error('No cars found matching the specified criteria.');
            }

            const carsDTO = cars.map((car) => new CarDTO(car));

            return new PaginateCarDTO(carsDTO, total, limit, offset);
    }

    async delete(id: number): Promise<void> {
        const carRepository = AppDataSource.getRepository(Car);

        const car = await carRepository.findOneBy({ id });

        if (!car) {
            throw new Error("Car doesnt exists!");
        }

        await carRepository.remove(car);

    }

    // Outros métodos como listar, atualizar e remover podem ser adicionados aqui.
}
