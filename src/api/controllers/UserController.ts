import { NextFunction, Request, Response } from 'express';
import UserService from '../services/UserServices';
import { BusinessError, UnauthorizedError } from '../errors/AppError';

export default class UserController {
    public async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { name, cpf, birth, cep, email, password } = req.body;
        try {
            const userService = new UserService();

            const validateCPF = (cpf: string): boolean => {
                cpf = cpf.replace(/[^\d]+/g, '');

                if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
                    return false;
                }

                return true;
            }

            if (!validateCPF(cpf)) {
                throw new BusinessError("CPF is not valid!");
            }

            const user = await userService.create({
                name,
                cpf,
                birth,
                cep,
                email,
                password
            });

            return res.status(201).json(user);
        } catch (error) {
            next(error);
        }

    }

    public async authenticate(req: Request, res: Response): Promise<Response> {
        const userService = new UserService();

        const { email, password } = req.body;

        const token = await userService.authenticate({ email, password });

        return res.status(201).json({accesToken: token});
    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const userService = new UserService();
        const { id } = req.params;
        const userId = Number(id);
        const authenticatedUser = req.user.id;
        const { name, cpf, birth, cep, email } = req.body;


        try {
            if (userId !== authenticatedUser) {
                throw new UnauthorizedError("You are not allowed to update this user");
            }
            const updateUser = await userService.update(userId, {
                name,
                cpf,
                birth,
                cep,
                email
            });

            return res.status(200).json(updateUser);
        } catch (error) {
            next(error);
        }

    }

    public async findId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const userService = new UserService();
        const { id } = req.params;
        const userId = Number(id);
        const authenticatedUser = req.user.id;

        try {
            if (userId !== authenticatedUser) {
                throw new UnauthorizedError("You are not allowed to view this user");
            }
            const user = await userService.findId(userId);
            return res.status(200).json(user);
        }catch (error) {
            next(error)
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { id } = req.params;
        const userId = Number(id);
        const authenticatedUser = req.user.id;

        try {
            if (userId !== authenticatedUser) {
               throw new UnauthorizedError("You are not allowed to delete this user");
            }
            const userService = new UserService();
            await userService.delete(userId);
            return res.status(204).send();
        }catch (error) {
            next(error);
        }

    }

}
