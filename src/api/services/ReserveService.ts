import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { ReserveDTO } from "../dtos/ReserveDTO";
import Car from '../models/CarModel';
import Reserve from '../models/ReserveModel';
import Users from '../models/UserModel';
import { PaginateReserveDTO } from '../dtos/PaginateReserveDTO';
import ReserveRepository from '../repositories/ReserveRepository';
import { BusinessError } from '../errors/AppError';

interface IRequest {
    startDate: Date;
    endDate: Date;
    carId: number;
}

interface IUpdateRequest {
    startDate?: Date;
    endDate?: Date;
    carId?: number;
}

interface IListRequest {
    startDate?: Date;
    endDate?: Date;
    finalValue?: number;
    carModel?: string;
    carColor?: string;
    carYear?: number;
    limit?: number;
    offset?: number;
}


export default class ReserveService {
    private reserveRepository: ReserveRepository;

    constructor(){
        this.reserveRepository = new ReserveRepository();
    }

    async create(id: number, { startDate, endDate, carId }: IRequest): Promise<ReserveDTO> {
        const userRepository = AppDataSource.getRepository(Users);
        const reserveRepository = AppDataSource.getRepository(Reserve);
        const carRepository = AppDataSource.getRepository(Car);

        const user = await userRepository.findOneBy({id});

        if (!user) {
            throw new BusinessError("User not found");
        }

        const car = await carRepository.findOne({where: {id: carId } });

        if (!car) {
            throw new BusinessError("Car not found");
        }

        if (!user.qualified) {
            throw new BusinessError("Only users over 18 are allowed to make a reservation!");
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new BusinessError("Invalid date format");
        }

        if (start >= end) {
            throw new BusinessError("Invalid date range: Start date must be before end date.");
        }

        const reserve = reserveRepository.create({
            startDate: start,
            endDate: end,
            finalValues: this.calculateFinalValue(start, end, car),
            user,
            car,
        });

        await reserveRepository.save(reserve);

        return new ReserveDTO(reserve);
    }

    async list(id: number, {
        startDate,
        endDate,
        finalValue,
        carModel,
        carColor,
        carYear,
        limit = 10,
        offset = 0,}: IListRequest): Promise<PaginateReserveDTO> {

            const reserves = await this.reserveRepository.list(id, {
                startDate,
                endDate,
                finalValue,
                carModel,
                carColor,
                carYear,
                limit,
                offset
            });

            const total = await this.reserveRepository.count(id, {
                startDate,
                endDate,
                finalValue,
                carModel,
                carColor,
                carYear,
            });

            if (total === 0 && (startDate || endDate || finalValue || carModel || carColor || carYear)) {
                throw new BusinessError('No reserves found matching the specified criteria.');
            }

            const reservesDTO = reserves.map((reserve) => new ReserveDTO(reserve));

            return new PaginateReserveDTO(reservesDTO, total, limit, offset);
    }

    async findId(userId: number, reserveId: number): Promise<ReserveDTO | null> {
        const reserve = await this.reserveRepository.findById(userId, reserveId);
        if (!reserve) {
            throw new BusinessError('Reserve not found');
        }

        return new ReserveDTO(reserve);
    }

    async update(userId: number, reserveId: number, { startDate, endDate, carId }: IUpdateRequest): Promise<ReserveDTO> {
        const reserve = await this.reserveRepository.findById(userId, reserveId);

        if (!reserve) {
            throw new BusinessError('Reserve not found');
        }

        if (startDate) {
            const start = new Date(startDate);
            if (isNaN(start.getTime())) {
                throw new BusinessError("Invalid date format");
            }

            reserve.startDate = start;
        }
        if (endDate) {
            const end = new Date(endDate);
            if (isNaN(end.getTime())) {
                throw new BusinessError("Invalid date format");
            }
            reserve.endDate = end;
        }
        if (carId) {
            reserve.car.id = carId;
        }
        const reserveRepo = AppDataSource.getRepository(Reserve);
        await reserveRepo.save(reserve);
        return new ReserveDTO(reserve);
    }

    async delete(userId: number, reserveId: number): Promise<void> {
        const reserve = await this.reserveRepository.findById(userId, reserveId);

        if (!reserve) {
            throw new BusinessError('Reserve not found');
        }

        const reserveRepo = AppDataSource.getRepository(Reserve);
        await reserveRepo.remove(reserve);
    }

    async carReserved({ startDate, endDate, carId }: IRequest): Promise<boolean> {
        const reserveRepository = AppDataSource.getRepository(Reserve);

        const start = new Date(startDate);
        const end = new Date(endDate);

        const existCarReserve = await reserveRepository.findOne({
            where: {
                car: {id: carId},
                startDate: LessThanOrEqual(end),
                endDate: MoreThanOrEqual(start),
            },
        });

        return !!existCarReserve;
    }

    private calculateFinalValue(startDate: Date, endDate: Date, car: Car): number {
        const timeDiff = new Date(endDate).getTime() - new Date(startDate).getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));  // Arredondar para cima
        return days * car.valuePerDay;  // Supondo que Car tenha um campo dailyRate
    }
}
