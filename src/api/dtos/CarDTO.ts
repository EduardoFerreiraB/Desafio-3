// src/modules/CAR/dtos/CarDTO.ts
import Car from '../models/CarModel';

export class CarDTO {
    public id: number;
    public model: string;
    public color: string;
    public year: number;
    public valuePerDay: number;
    public acessories: {name: string}[];
    public numberOfPassengers: number;

    constructor(car: Car) {
        this.id = car.id;
        this.model = car.model;
        this.color = car.color;
        this.year = car.year;
        this.valuePerDay = car.valuePerDay;
        this.acessories = car.acessories.map(accesory => ({ name: accesory}));
        this.numberOfPassengers = car.numberOfPassengers;
    }
}
