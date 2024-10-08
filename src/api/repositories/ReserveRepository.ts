import { AppDataSource } from "../../database/data-source";
import Reserve from "../models/ReserveModel";

interface IListReserve {
    startDate?: Date;
    endDate?: Date;
    finalValue?: number;
    carModel?: string;
    carColor?: string;
    carYear?: number;
    limit?: number;
    offset?: number;
}

export default class ReserveRepository {
    private reserveRepository = AppDataSource.getRepository(Reserve);

    async list(id: number, {
        startDate,
        endDate,
        finalValue,
        carModel,
        carColor,
        carYear,
        limit = 10,
        offset = 0,
    }: IListReserve): Promise<Reserve[]> {
        const queryBuilder = this.reserveRepository.createQueryBuilder('reserves')
        .leftJoinAndSelect('reserves.car', 'car')
        .leftJoinAndSelect('reserves.user', 'user')
        .where('reserves.user_id = :userId', { userId: id });

        if (startDate) {
            queryBuilder.andWhere('reserves.startDate >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('reserves.endDate <= :endDate', { endDate });
        }
        if (finalValue) {
            queryBuilder.andWhere('reserves.finalValues = :finalValue', { finalValue });
        }

        if (carModel) {
            queryBuilder.andWhere('car.model = :carModel', { carModel });
        }
        if (carColor) {
            queryBuilder.andWhere('car.color = :carColor', { carColor });
        }
        if (carYear) {
            queryBuilder.andWhere('car.year = :carYear', { carYear });
        }

        queryBuilder.skip(offset).take(limit)

        return await queryBuilder.getMany();
    }

    async count(id: number, {
        startDate,
        endDate,
        finalValue,
        carModel,
        carColor,
        carYear,
    }: IListReserve): Promise<number> {
        const queryBuilder = this.reserveRepository.createQueryBuilder('reserves')
        .leftJoinAndSelect('reserves.car', 'car')
        .where('reserves.user = :userId', { userId: id });

        if (startDate) {
            queryBuilder.andWhere('reserves.startDate >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('reserves.endDate <= :endDate', { endDate });
        }
        if (finalValue) {
            queryBuilder.andWhere('reserves.finalValues = :finalValue', { finalValue });
        }

        if (carModel) {
            queryBuilder.andWhere('car.model = :carModel', { carModel });
        }
        if (carColor) {
            queryBuilder.andWhere('car.color = :carColor', { carColor });
        }
        if (carYear) {
            queryBuilder.andWhere('car.year = :carYear', { carYear });
        }

        return await queryBuilder.getCount();
    }

    async findById(id: number, reserveId: number): Promise<Reserve | null> {
        return await this.reserveRepository.createQueryBuilder('reserves')
        .leftJoinAndSelect('reserves.car', 'car')
        .leftJoinAndSelect('reserves.user', 'user')
        .where('reserves.id = :reserveId', {reserveId})
        .andWhere('reserves.user_id = :userId', { userId: id })
        .getOne();
    }
}
