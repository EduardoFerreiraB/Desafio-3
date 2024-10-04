import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Acessory from "./AcessoryModel";
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

    @OneToMany(() => Acessory, (acessory) => acessory.car, {
        cascade: true,
        eager: true,
    })
    acessories: Acessory[];

    @OneToMany(() => Reserve, (reserve) => reserve.car, {
        cascade: true,
        eager: true
    })
    reserves: Reserve[];

    @CreateDateColumn()
    createdAt: Date

    @CreateDateColumn()
    updatedAt: Date
}

export default Car;
