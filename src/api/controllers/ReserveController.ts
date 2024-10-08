import { NextFunction, Request, Response } from 'express';
import ReserveService from '../services/ReserveService';
import { BusinessError, UnauthorizedError } from '../errors/AppError';

interface ReserveQuery {
    startDate?: string | Date;
    endDate?: string | Date;
    finalValue?: string | number;
    carModel?: string;
    carColor?: string;
    carYear?: string | number;
    limit?: string | number;
    offset?: string | number;
}

export default class ReserveController {

    public async create(req: Request, res: Response, next: NextFunction): Promise<Response | void > {
        const reserveService = new ReserveService();
        const authenticatedUser = req.user.id;
        const { startDate, endDate, carId } = req.body;

        try {
            const parsedStartDate = parseDate(startDate);
            const parsedEndDate = parseDate(endDate);

            if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
               throw new BusinessError("Invalid date format. Use DD/MM/YYYY.");
            }

            const existCarReserve = await reserveService.carReserved({
                startDate: parsedStartDate,
                endDate: parsedEndDate,
                carId,
            });

            if (existCarReserve) {
                throw new BusinessError("O carro selecionado já possui reserva para estas datas.")
            }

            const createReserve = await reserveService.create(authenticatedUser, {
                startDate: parsedStartDate,
                endDate: parsedEndDate,
                carId,
            });

            return res.status(200).json(createReserve);
        } catch (error) {
            next(error);
        }

    }

    public async list(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const reserveService = new ReserveService();

        const authenticatedUser = req.user?.id;

        const {
            startDate,
            endDate,
            finalValue,
            carModel,
            carColor,
            carYear,
            limit,
            offset
        } = req.query as ReserveQuery;

        try {
            if (!authenticatedUser) {
                throw new UnauthorizedError("You are not authenticated!");
            }
            const reserves = await reserveService.list(authenticatedUser, {
                startDate: startDate ? new Date(startDate.toString()): undefined,
                endDate: endDate ? new Date(endDate.toString()) : undefined,
                finalValue: finalValue ? Number(finalValue) : undefined,
                carModel: carModel ? carModel.toString() : undefined,
                carColor: carColor ? carColor.toString() : undefined,
                carYear: carYear ? Number(carYear) : undefined,
                limit: limit ? Number(limit) : undefined,
                offset: offset ? Number(offset) : undefined,
            });

            return res.status(200).json(reserves);
        } catch (error) {
            next(error)
        }
    }

    public async findId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const reserveService = new ReserveService();
        const { id } = req.params;
        const reserveId = Number(id);
        const authenticatedUser = req.user?.id;

        try {
            if (!authenticatedUser) {
                throw new UnauthorizedError("You are not authenticated!");
            }
            const reserve = await reserveService.findId(authenticatedUser, reserveId);

            return res.status(200).json(reserve);
        }catch (error) {
            next(error)
        }
    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const reserveService = new ReserveService();
        const { id } = req.params;
        const reserveId = Number(id);
        const authenticatedUser = req.user?.id;

        const { startDate, endDate, carId } = req.body

        try {
            const parsedStartDate = startDate ? parseDate(startDate): undefined;
            const parsedEndDate = endDate ? parseDate(endDate): undefined;

            if (!authenticatedUser) {
                throw new UnauthorizedError("You are not authenticated!");
            }

            if (startDate && (!parsedStartDate || isNaN(parsedStartDate.getTime()))) {
                throw new BusinessError("Invalid end date format. Use DD/MM/YYYY.");
            }

            if (endDate && (!parsedEndDate || isNaN(parsedEndDate.getTime()))) {
               throw new BusinessError("Invalid end date format. Use DD/MM/YYYY.");
            }

            const updateReserve = await reserveService.update(authenticatedUser, reserveId, {
                startDate: parsedStartDate,
                endDate: parsedEndDate,
                carId
            });

            return res.status(200).json(updateReserve);
        } catch (error) {
            next(error)
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const reserveService = new ReserveService();
        const { id } = req.params;
        const reserveId = Number(id);
        const authenticatedUser = req.user?.id;

        try {
            if (!authenticatedUser) {
                throw new UnauthorizedError("You are not authenticated!");
            }
            await reserveService.delete(authenticatedUser, reserveId);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }


}

function parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // O mês é indexado de 0 a 11
}
