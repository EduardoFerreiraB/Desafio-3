import { ReserveDTO } from "./ReserveDTO";

export class PaginateReserveDTO {
    public reserves: ReserveDTO[];
    public total: number;
    public limit: number;
    public offset: number;
    public offsets: number;

    constructor(reserve: ReserveDTO[], total: number, limit: number, offset: number) {
        this.reserves = reserve;
        this.total = total;
        this.limit = limit;
        this.offset = offset;
        this.offsets = Math.ceil(total / limit);
    }
}
