import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Car from "./CarModel";
import Users from "./UserModel";


@Entity('reserves')
class Reserve {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    startDate: Date

    @Column()
    endDate: Date

    @Column()
    finalValues: number

    @ManyToOne(() => Users, (user) => user.reserves)
    @JoinColumn({ name: 'user_id '})
    user: Users;

    @ManyToOne(() => Car)
    @JoinColumn({ name: 'car_id '})
    car: Car

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export default Reserve;
