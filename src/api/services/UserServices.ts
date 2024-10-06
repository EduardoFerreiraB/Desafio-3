import { AppDataSource } from '../../database/data-source';
import { UserDTO } from "../dtos/UserDTO";
import Users from "../models/UserModel";
import axios from "axios";
import bcrypt from "bcryptjs";
import { generateToken } from './authServices';

interface IRequest {
    name: string;
    cpf: string;
    birth: Date;
    cep: string
    email: string;
    password: string;
}

interface IAuthenticate {
    email: string;
    password: string;
}

interface IUpdateRequest {
    name?: string;
    cpf?: string;
    birth?: Date;
    cep?: string
    email?: string;
}

export default class UserService {
    async create({ name, cpf, birth, cep, email, password}: IRequest): Promise<UserDTO> {

        const today = new Date();
        let age = today.getFullYear() - new Date(birth).getFullYear();
        const monthDiff = today.getMonth() - new Date(birth).getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < new Date(birth).getDate())) {
            age--;
        }
        const qualified = age >= 18;

        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const addressData = response.data;
        const hashedPassword = await bcrypt.hash(password, 8);

        const userRepository = AppDataSource.getRepository(Users);
        const user = userRepository.create({
            name,
            cpf,
            birth,
            cep,
            email,
            password: hashedPassword,
            qualified,
            neighbordhood: addressData.bairro,
            street: addressData.logradouro,
            city: addressData.localidade,
            uf: addressData.uf
        });

        await userRepository.save(user);

        return new UserDTO(user);
    }

    async authenticate({ email, password}: IAuthenticate): Promise<string> {
        const userRepository = AppDataSource.getRepository(Users);

        const user = await userRepository.findOne({where: { email } });

        if (!user) {
            throw new Error("Invalid email or password!");
        }

        const passwordIsOk = await bcrypt.compare(password, user.password);

        if (!passwordIsOk) {
            throw new Error("Invalid email or password!");
        }

        const token = generateToken(user.id);

        return token;
    }

    async update(id: number, { name, cpf, birth, cep, email }: IUpdateRequest): Promise<UserDTO> {
        const userRepository = AppDataSource.getRepository(Users);

        const user = await userRepository.findOneBy({id});

        if (!user) {
            throw new Error("User not found");
        }

        if (name) {
            user.name = name;
        }
        if (cpf) {
            user.cpf = cpf;
        }
        if (birth) {
            user.birth = birth;
        }
        if (cep) {
            user.cep = cep;
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const addressData = response.data;
            user.neighbordhood = addressData.bairro;
            user.street = addressData.logradouro;
            user.city = addressData.localidade;
            user.uf = addressData.uf;
        }
        if (email) {
            user.email = email;
        }

        await userRepository.save(user);

        return new UserDTO(user);
    }

    async findId(id: number): Promise<UserDTO> {
        const carRepository = AppDataSource.getRepository(Users);

        const user = await carRepository.findOne({where: { id }});

        if (!user) {
            throw new Error('Car not found');
        }

        return new UserDTO(user);
    }

    async delete(id: number): Promise<void> {
        const userRepository = AppDataSource.getRepository(Users);

        const user = await userRepository.findOneBy({ id });

        if (!user) {
            throw new Error("User doesnt exists!");
        }

        await userRepository.remove(user);

    }
}
