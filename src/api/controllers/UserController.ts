import { Request, Response } from 'express';
import UserService from '../services/UserServices';

export default class UserController {
    public async create(req: Request, res: Response): Promise<Response> {
        const userService = new UserService();

        const { name, cpf, birth, cep, email, password } = req.body;

        const user = await userService.create({
            name,
            cpf,
            birth,
            cep,
            email,
            password
        });

        return res.status(201).json(user);
    }

    public async authenticate(req: Request, res: Response): Promise<Response> {
        const userService = new UserService();

        const { email, password } = req.body;

        const token = await userService.authenticate({ email, password });

        return res.status(201).json({accesToken: token});
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const userService = new UserService();
        const { id } = req.params;
        const userId = Number(id);
        const authenticatedUser = req.userId;
        const { name, cpf, birth, cep, email } = req.body;
        if (userId !== authenticatedUser) {
            return res.status(403).json({message: "You are not allowed to update this user"});
        }

        try {
            const updateUser = await userService.update(userId, {
                name,
                cpf,
                birth,
                cep,
                email
            });

            return res.status(200).json(updateUser);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({message: error.message});
            }

            return res.status(500).json({message: "Internal server error"});
        }
    }
}