import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Car from "./CarModel";


@Entity('acessories')
class Acessory {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @ManyToOne(() => Car, (car) => car.acessories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'car_id'})
    car: Car

    @CreateDateColumn()
    createdAt: Date

    @CreateDateColumn()
    updatedAt: Date
}

export default Acessory;
