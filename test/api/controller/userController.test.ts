import { Request, Response } from 'express';
import UserController from '../../../src/api/controllers/UserController';
import UserService from '../../../src/api/services/UserServices';
import { BusinessError, UnauthorizedError } from '../../../src/api/errors/AppError';

jest.mock('../../../src/api/services/UserServices.ts');

describe('UserController', () => {
    let userController: UserController;

    beforeEach(() => {
        userController = new UserController();
    });

    describe('create', () => {
        it('should create a user and return 201', async () => {
            const req = {
                body: {
                    name: 'John Doe',
                    cpf: '12345678901',
                    birth: '1990-01-01',
                    cep: '12345-678',
                    email: 'john@example.com',
                    password: 'password'
                },
            } as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            (UserService.prototype.create as jest.Mock).mockResolvedValue(req.body);

            await userController.create(req, res, jest.fn());

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(req.body);
        });

        it('should throw BusinessError for invalid CPF', async () => {
            const req = {
                body: {
                    name: 'John Doe',
                    cpf: 'invalid-cpf',
                    birth: '1990-01-01',
                    cep: '12345-678',
                    email: 'john@example.com',
                    password: 'password'
                },
            } as Request;

            const res = {} as Response;
            const next = jest.fn();

            await userController.create(req, res, next);

            expect(next).toHaveBeenCalledWith(new BusinessError("CPF is not valid!"));
        });
    });

    describe('authenticate', () => {
        it('should authenticate user and return token', async () => {
            const req = {
                body: {
                    email: 'john@example.com',
                    password: 'password'
                },
            } as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const mockToken = 'mockToken';
            (UserService.prototype.authenticate as jest.Mock).mockResolvedValue(mockToken);

            await userController.authenticate(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ accesToken: mockToken });
        });
    });

    describe('update', () => {
        it('should update user and return updated user', async () => {
            const req = {
                params: { id: '1' },
                body: {
                    name: 'John Updated',
                    cpf: '12345678901',
                    birth: '1990-01-01',
                    cep: '12345-678',
                    email: 'john@example.com',
                },
                user: { id: 1 },
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const updatedUser = { ...req.body, id: 1 };
            (UserService.prototype.update as jest.Mock).mockResolvedValue(updatedUser);

            await userController.update(req, res, jest.fn());

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });

        it('should throw UnauthorizedError if user ID does not match', async () => {
            const req = {
                params: { id: '1' },
                body: {
                    name: 'John Updated',
                    cpf: '12345678901',
                    birth: '1990-01-01',
                    cep: '12345-678',
                    email: 'john@example.com',
                },
                user: { id: 2 },
            } as unknown as Request;

            const res = {} as Response;
            const next = jest.fn();

            await userController.update(req, res, next);

            expect(next).toHaveBeenCalledWith(new UnauthorizedError("You are not allowed to update this user"));
        });
    });

    describe('findId', () => {
        it('should find user by ID and return user', async () => {
            const req = {
                params: { id: '1' },
                user: { id: 1 },
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const user = { id: 1, name: 'John Doe' };
            (UserService.prototype.findId as jest.Mock).mockResolvedValue(user);

            await userController.findId(req, res, jest.fn());

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it('should throw UnauthorizedError if user ID does not match', async () => {
            const req = {
                params: { id: '1' },
                user: { id: 2 },
            } as unknown as Request;

            const res = {} as Response;
            const next = jest.fn();

            await userController.findId(req, res, next);

            expect(next).toHaveBeenCalledWith(new UnauthorizedError("You are not allowed to view this user"));
        });
    });

    describe('delete', () => {
        it('should delete user and return 204', async () => {
            const req = {
                params: { id: '1' },
                user: { id: 1 },
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as Response;

            (UserService.prototype.delete as jest.Mock).mockResolvedValue(undefined);

            await userController.delete(req, res, jest.fn());

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should throw UnauthorizedError if user ID does not match', async () => {
            const req = {
                params: { id: '1' },
                user: { id: 2 },
            } as unknown as Request;

            const res = {} as Response;
            const next = jest.fn();

            await userController.delete(req, res, next);

            expect(next).toHaveBeenCalledWith(new UnauthorizedError("You are not allowed to delete this user"));
        });
    });
});
