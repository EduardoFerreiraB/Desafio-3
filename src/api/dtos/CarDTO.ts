// src/modules/CAR/dtos/CarDTO.ts
import Car from '../models/CarModel';
import Acessory from '../models/AcessoryModel';

export class CarDTO {
    public id: number;
    public model: string;
    public color: string;
    public year: number;
    public valuePerDay: number;
    public accessories: string[]; // Array de objetos Acessory
    public numberOfPassengers: number;

    constructor(car: Car) {
        this.id = car.id;
        this.model = car.model;
        this.color = car.color;
        this.year = car.year;
        this.valuePerDay = car.valuePerDay;
        this.accessories = car.acessories.map((accesory: Acessory) => accesory.name); // Acessory[] agora está correto
        this.numberOfPassengers = car.numberOfPassengers;
    }
}
