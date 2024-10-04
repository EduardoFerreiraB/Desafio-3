import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Reserve from "./ReserveModel";


@Entity('users')
class Users {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    cpf: string

    @Column()
    birth: Date

    @Column()
    cep: string

    @Column()
    password: string

    @OneToMany(() => Reserve, (reserve) => reserve.user)
    reserves: Reserve[];

    @CreateDateColumn()
    createdAt: Date

    @CreateDateColumn()
    updatedAt: Date
}

export default Users;
