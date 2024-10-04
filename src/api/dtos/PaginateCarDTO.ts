import { CarDTO } from "./CarDTO";

export class PaginateCarDTO {
    public car: CarDTO[];
    public total: number;
    public limit: number;
    public offset: number;
    public offsets: number;

    constructor(car: CarDTO[], total: number, limit: number, offset: number) {
        this.car = car;
        this.total = total;
        this.limit = limit;
        this.offset = offset;
        this.offsets = Math.ceil(total / limit);
    }
}
