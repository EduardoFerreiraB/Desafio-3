import  Car  from '../models/CarModel';
import { CarDTO } from '../dtos/CarDTO';
import { AppDataSource } from '../../database/data-source';
import CarRepository from '../repositories/CarRepository';
import { PaginateCarDTO } from '../dtos/PaginateCarDTO';
import {AppError, IdError} from '../errors/AppError';


interface IRequest {
    model: string;
    color: string;
    year: number;
    valuePerDay: number;
    acessories: { name: string }[];
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

        const accessories = acessories.map(accessory => accessory.name);
        const car = carRepository.create({
            model,
            color,
            year,
            valuePerDay,
            acessories: accessories,
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

    async findId(id: number): Promise<CarDTO> {
        const carRepository = AppDataSource.getRepository(Car);

        const car = await carRepository.findOne({where: { id }});

        if (!car) {
            throw new IdError('Car doesnt exists!');
        }

        return new CarDTO(car);
    }

    async delete(id: number): Promise<void> {
        const carRepository = AppDataSource.getRepository(Car);

        const car = await carRepository.findOneBy({ id });

        if (!car) {
            throw new IdError("Car doesnt exists!");
        }

        await carRepository.remove(car);

    }

    async update(id: number, { model, color, year, valuePerDay, acessories, numberOfPassengers }: IRequest):
    Promise<CarDTO> {

        const carRepository = AppDataSource.getRepository(Car);

        const car = await carRepository.findOneBy({ id });

        if (!car) {
            throw new IdError("Car doesnt exists!");
        }

        car.model = model || car.model;
        car.color = color || car.color;
        car.year = year || car.year;
        car.valuePerDay = valuePerDay || car.valuePerDay;
        car.numberOfPassengers = numberOfPassengers || car.numberOfPassengers;

        if (acessories && Array.isArray(acessories)) {
            car.acessories = acessories.map(accessory => {
                if (typeof accessory.name !== 'string') {
                    throw new Error("Invalid accessory format. Name must be a string.");
                }
                return accessory.name;
            });
        }


        await carRepository.save(car);
        return new CarDTO(car);
    }

    async updateAcessory(id: number, {name}: {name: string}): Promise<CarDTO> {
        const carRepository = AppDataSource.getRepository(Car);

        const car = await carRepository.findOneBy({id});

        if (!car) {
            throw new IdError("Car not found");
        }

        if (!name || !name.trim()) {
            throw new AppError("Accessory name is required");
        }

        const normalizedAccessory = name.trim().toLowerCase();
        const normalizedAcessories = car.acessories.map(accessory => accessory.trim().toLowerCase());

        const accessoryIndex = normalizedAcessories.indexOf(normalizedAccessory);

        if (accessoryIndex !== -1) {

            car.acessories.splice(accessoryIndex, 1);
        } else {
            if (name && name.trim()) {
                car.acessories.push(name.trim());
            }
        }

        await carRepository.save(car);

        return new CarDTO(car);
    }
}
