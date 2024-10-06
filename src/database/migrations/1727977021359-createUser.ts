import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUser1727977021359 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'cpf',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'birth',
                        type: 'date',
                    },
                    {
                        name: 'qualified',
                        type: 'boolean',
                        default: true
                    },
                    {
                        name: 'cep',
                        type: 'varchar',
                    },
                    {
                        name: "neighbordhood",
                        type: "varchar",
                    },
                    {
                        name: "street",
                        type: "varchar",
                    },
                    {
                        name: "complement",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "city",
                        type: "varchar",
                    },
                    {
                        name: "uf",
                        type: "varchar",
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}
