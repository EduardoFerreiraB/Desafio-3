import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Reserve from "./ReserveModel";


@Entity('cars')
class Car {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    model: string

    @Column()
    color: string

    @Column()
    year: number

    @Column()
    valuePerDay: number

    @Column()
    numberOfPassengers: number;

    @Column("simple-array")
    acessories: string[];

    @OneToMany(() => Reserve, (reserve) => reserve.car, {
        cascade: true,
    })
    reserves: Reserve[];

    @CreateDateColumn()
    createdAt: Date

    @CreateDateColumn()
    updatedAt: Date
}

export default Car;
