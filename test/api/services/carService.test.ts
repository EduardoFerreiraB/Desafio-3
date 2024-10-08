import { AppDataSource } from '../../../src/database/data-source'; // DataSource importado
import CarService from '../../../src/api/services/CarServices'; // Importe o serviço de carro
import Car from '../../../src/api/models/CarModel';

describe('CarService', () => {
    let carService: CarService;

    beforeAll(async () => {
        await AppDataSource.initialize();
        carService = new CarService();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    beforeEach(async () => {
        await AppDataSource.getRepository(Car).clear(); // Limpa a tabela de carros
    });

    describe('create - Registrar um carro', () => {
        test('Deve registrar um carro com sucesso', async () => {
            const carData = {
                model: 'GM S10 2.8',
                color: 'white',
                year: 2020,
                valuePerDay: 50,
                acessories: [{ name: 'Air conditioner' }],
                numberOfPassengers: 5,
            };

            const car = await carService.create(carData);

            expect(car).toHaveProperty('id');
            expect(car.model).toBe('GM S10 2.8');
            expect(car.acessories.length).toBe(1);
        });
    });

    describe('listCars - Listar todos os carros', () => {
        test('Deve listar todos os carros', async () => {
            await AppDataSource.getRepository(Car).save([
                { model: 'GM S10', color: 'white', year: 2020, valuePerDay: 50, acessories: ['Air conditioner'], numberOfPassengers: 5 },
                { model: 'Toyota Hilux', color: 'black', year: 2021, valuePerDay: 60, acessories: ['GPS'], numberOfPassengers: 5 },
            ]);

            const cars = await carService.list({ limit: 10 });

            expect(cars).toHaveProperty('car');
            expect(cars.car.length).toBeLessThanOrEqual(10);
            expect(cars).toHaveProperty('total');
        });

        test('Deve filtrar os carros por parâmetros (ex: cor)', async () => {
            await AppDataSource.getRepository(Car).save([
                { model: 'GM S10', color: 'white', year: 2020, valuePerDay: 50, acessories: ['Air conditioner'], numberOfPassengers: 5 },
                { model: 'Toyota Hilux', color: 'black', year: 2021, valuePerDay: 60, acessories: ['GPS'], numberOfPassengers: 5 },
            ]);

            const cars = await carService.list({ color: 'white' });

            expect(cars.car.every(car => car.color === 'white')).toBe(true);
        });
    });

    describe('getCarById - Listar um carro pelo ID', () => {
        test('Deve retornar os detalhes de um carro pelo ID', async () => {
            const car = await AppDataSource.getRepository(Car).save({
                model: 'GM S10 2.8',
                color: 'white',
                year: 2020,
                valuePerDay: 50,
                acessories: ['Air conditioner'],
                numberOfPassengers: 5,
            });

            const foundCar = await carService.findId(car.id);

            expect(foundCar).toHaveProperty('id', car.id);
            expect(foundCar.model).toBe('GM S10 2.8');
        });

        test('Deve lançar um erro se o carro não for encontrado', async () => {
            await expect(carService.findId(999)).rejects.toThrow('Car doesnt exists!'); // Ajuste a mensagem de erro conforme sua implementação
        });
    });

    describe('updateCar - Atualizar um carro', () => {
        test('Deve atualizar os detalhes de um carro', async () => {
            const car = await AppDataSource.getRepository(Car).save({
                model: 'GM S10 2.8',
                color: 'white',
                year: 2020,
                valuePerDay: 50,
                acessories: ['Air conditioner'],
                numberOfPassengers: 5,
            });

            const updatedData = {
                model: 'GM S10 2.8 Turbo',
                color: 'black',
                year: 2023,
                valuePerDay: 60,
                acessories: [{ name: 'Sunroof' }, { name: 'GPS' }],
                numberOfPassengers: 4,
            };

            const updatedCar = await carService.update(car.id, updatedData);

            expect(updatedCar.model).toBe('GM S10 2.8 Turbo');
            expect(updatedCar.acessories.length).toBe(2);
            expect(updatedCar.color).toBe('black');
        });

        test('Deve lançar um erro se o carro a ser atualizado não for encontrado', async () => {
            const updatedData = {
                model: 'Carro não existente',
                color: 'black',
                year: 2023,
                valuePerDay: 60,
                acessories: [{ name: 'Sunroof' }, { name: 'GPS' }],
                numberOfPassengers: 4,
            };

            await expect(carService.update(999, updatedData)).rejects.toThrow('Car doesnt exists!'); // Ajuste a mensagem de erro conforme sua implementação
        });
    });

    describe('deleteCar - Remover um carro', () => {
        test('Deve remover um carro com sucesso', async () => {
            const car = await AppDataSource.getRepository(Car).save({
                model: 'GM S10 2.8',
                color: 'white',
                year: 2020,
                valuePerDay: 50,
                acessories: ['Air conditioner'],
                numberOfPassengers: 5,
            });

            await carService.delete(car.id);

            const foundCar = await AppDataSource.getRepository(Car).findOne({ where: { id: car.id } });

            expect(foundCar).toBeNull(); // O carro deve ser removido
        });

        test('Deve lançar um erro se o carro a ser removido não for encontrado', async () => {
            await expect(carService.delete(999)).rejects.toThrow('Car doesnt exists!'); // Ajuste a mensagem de erro conforme sua implementação
        });
    });
});
