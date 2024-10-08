import Reserve from '../models/ReserveModel';

export class ReserveDTO {
    public id: number;
    public startDate: Date;
    public endDate: Date;
    public finalValue: number;
    public userId: number;
    public carId: number;

    constructor(reserve: Reserve) {
        this.id = reserve.id;
        this.startDate = reserve.startDate;
        this.endDate = reserve.endDate;
        this.finalValue = reserve.finalValues;
        this.userId = reserve.user.id;
        this.carId = reserve.car.id;
    }
}
