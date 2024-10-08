import request from 'supertest';
import { AppDataSource } from '../../../src/database/data-source'; // DataSource importado
import app from '../../../src/server';
import Car from '../../../src/api/models/CarModel';

describe('CarController', () => {
    type Car = {
        id: number;
        model: string;
        color: string;
        year: number;
        valuePerDay: number;
        acessories: { name: string }[];
        numberOfPassengers: number;
    };


    beforeAll(async () => {
        await AppDataSource.initialize();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    beforeEach(async () => {
        await AppDataSource.getRepository(Car).clear(); // Limpa a tabela de carros
    });

    describe('POST v1/car - Registrar um carro', () => {
        test('Deve registrar um carro com sucesso', async () => {
            const carData = {
                model: 'GM S10 2.8',
                color: 'white',
                year: 2020,
                valuePerDay: 50,
                acessories: [
                    { name: 'Air conditioner' }
                ],
                numberOfPassengers: 5
            };

            const res = await request(app).post('/v1/car').send(carData);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.model).toBe('GM S10 2.8');
            expect(res.body.acessories.length).toBe(1);
        });

        test('Deve retornar 400 se dados inválidos forem enviados', async () => {
            const carData = {
                model: '',
                color: 'white',
                year: 2020,
                valuePerDay: 50,
                acessories: [],
                numberOfPassengers: 5
            };

            const res = await request(app).post('/v1/car').send(carData);

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('GET v1/car - Listar todos os carros (Parâmetros e paginação)', () => {
        test('Deve listar todos os carros com paginação', async () => {
            await AppDataSource.getRepository(Car).save([
                { model: 'GM S10', color: 'white', year: 2020, valuePerDay: 50, acessories: ['Air conditioner'], numberOfPassengers: 5 },
                { model: 'Toyota Hilux', color: 'black', year: 2021, valuePerDay: 60, acessories: ['GPS'], numberOfPassengers: 5 }
            ]);

            const res = await request(app).get('/v1/car?page=1&limit=10');

            expect(res.statusCode).toBe(200); // Sucesso
            expect(res.body).toHaveProperty('car');
            expect(res.body.car.length).toBeLessThanOrEqual(10);
            expect(res.body).toHaveProperty('total');
        });

        test('Deve filtrar os carros por parâmetros (ex: cor)', async () => {

            await AppDataSource.getRepository(Car).save([
                { model: 'GM S10', color: 'white', year: 2020, valuePerDay: 50, acessories: ['Air conditioner'], numberOfPassengers: 5 },
                { model: 'Toyota Hilux', color: 'black', year: 2021, valuePerDay: 60, acessories: ['GPS'], numberOfPassengers: 5 }
            ]);

            const res = await request(app).get('/v1/car?color=white');

            expect(res.statusCode).toBe(200);
            expect((res.body.car as Car[]).every(car => car.color === 'white')).toBe(true);
        });
    });

    describe('GET v1/car/:id - Listar um carro pelo ID', () => {
        test('Deve retornar os detalhes de um carro pelo ID', async () => {
            const car = await AppDataSource.getRepository(Car).save({
                model: 'GM S10 2.8',
                color: 'white',
                year: 2020,
                valuePerDay: 50,
                acessories: ['Air conditioner'],
                numberOfPassengers: 5
            });

            const res = await request(app).get(`/v1/car/${car.id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('id', car.id);
            expect(res.body.model).toBe('GM S10 2.8');
        });

        test('Deve retornar 404 se o carro não for encontrado', async () => {
            const res = await request(app).get('/v1/car/999'); // ID inexistente

            expect(res.statusCode).toBe(404); // Não encontrado
            expect(res.body).toHaveProperty('message', 'Car doesnt exists!');
        });
    });

    describe('PUT v1/car/:id - Atualizar um carro', () => {
        test('Deve atualizar os detalhes de um carro', async () => {
            const car = await AppDataSource.getRepository(Car).save({
                model: 'GM S10 2.8',
                color: 'white',
                year: 2020,
                valuePerDay: 50,
                acessories: ['Air conditioner'],
                numberOfPassengers: 5
            });

            const updatedData = {
                model: 'GM S10 2.8 Turbo',
                color: 'black',
                year: 2023,
                valuePerDay: 60,
                acessories: [
                    { name: 'Sunroof' },
                    { name: 'GPS' }
                ],
                numberOfPassengers: 4
            };

            const res = await request(app).put(`/v1/car/${car.id}`).send(updatedData);

            expect(res.statusCode).toBe(200); // Sucesso na atualização
            expect(res.body.model).toBe('GM S10 2.8 Turbo');
            expect(res.body.acessories.length).toBe(2);
            expect(res.body.color).toBe('black');
        });

        test('Deve retornar 404 se o carro a ser atualizado não for encontrado', async () => {
            const res = await request(app).put('/v1/car/999').send({
                model: 'Carro não existente'
            });

            expect(res.statusCode).toBe(404); // Não encontrado
        });
    });

    describe('DELETE v1/car/:id - Remover um carro', () => {
        test('Deve remover um carro com sucesso', async () => {

            const car = await AppDataSource.getRepository(Car).save({
                model: 'GM S10 2.8',
                color: 'white',
                year: 2020,
                valuePerDay: 50,
                acessories: ['Air conditioner'],
                numberOfPassengers: 5
            });

            const res = await request(app).delete(`/v1/car/${car.id}`);

            expect(res.statusCode).toBe(204); // Removido com sucesso, sem conteúdo
        });

        test('Deve retornar 404 se o carro a ser removido não for encontrado', async () => {
            const res = await request(app).delete('/v1/car/999');

            expect(res.statusCode).toBe(404); // Não encontrado
        });
    });
});
