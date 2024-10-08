import { AppDataSource } from "../../database/data-source";
import Car from "../models/CarModel";

interface IListCarRequest {
    model?: string;
    color?: string;
    year?: number;
    valuePerDay?: number;
    numberOfPassengers?: number;
    limit?: number;
    offset?: number;
}

export default class CarRepository {
    private carRepository = AppDataSource.getRepository(Car);

    async list({
        model,
        color,
        year,
        valuePerDay,
        numberOfPassengers,
        limit = 10,
        offset = 0,
    }: IListCarRequest): Promise<Car[]> {
        const queryBuilder = this.carRepository.createQueryBuilder('car');

        if (model) {
            queryBuilder.andWhere('car.model = :model', { model });
        }
        if (color) {
            queryBuilder.andWhere('car.color = :color', { color });
        }
        if (year) {
            queryBuilder.andWhere('car.year = :year', { year });
        }
        if (valuePerDay) {
            queryBuilder.andWhere('car.valuePerDay = :valuePerDay', { valuePerDay });
        }
        if (numberOfPassengers) {
            queryBuilder.andWhere('car.numberOfPassengers = :numberOfPassengers', { numberOfPassengers });
        }

        queryBuilder.skip(offset).take(limit);

        return await queryBuilder.getMany();
    }

    async count({
        model,
        color,
        year,
        valuePerDay,
        numberOfPassengers,
    }: IListCarRequest): Promise<number> {
        const queryBuilder = this.carRepository.createQueryBuilder('car');

        if (model) {
            queryBuilder.andWhere('car.model = :model', { model });
        }
        if (color) {
            queryBuilder.andWhere('car.color = :color', { color });
        }
        if (year) {
            queryBuilder.andWhere('car.year = :year', { year });
        }
        if (valuePerDay) {
            queryBuilder.andWhere('car.valuePerDay = :valuePerDay', { valuePerDay });
        }
        if (numberOfPassengers) {
            queryBuilder.andWhere('car.numberOfPassengers = :numberOfPassengers', { numberOfPassengers });
        }

        return await queryBuilder.getCount();
    }
}
