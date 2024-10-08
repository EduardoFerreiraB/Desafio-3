import Users from '../models/UserModel';

export class UserDTO {
    public id: number;
    public name: string;
    public cpf: string;
    public birth: Date;
    public email: string;
    public qualified: boolean;
    public cep: string;
    public neighbordhood: string;
    public street: string;
    public complement: string;
    public city: string;
    public uf: string;

    constructor(user: Users) {
        this.id = user.id;
        this.name = user.name;
        this.cpf = user.cpf;
        this.birth = user.birth;
        this.email = user.email;
        this.qualified = user.qualified;
        this.cep = user.cep;
        this.neighbordhood = user.neighbordhood;
        this.street = user.street;
        this.complement = user.complement;
        this.city = user.city;
        this.uf = user.uf;
    }
}
