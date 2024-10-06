import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCar1727973131333 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'cars',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                    },
                    {
                        name: 'model',
                        type: 'varchar'
                    },
                    {
                        name: 'color',
                        type: 'varchar'
                    },
                    {
                        name: 'year',
                        type: 'int'
                    },
                    {
                        name: 'valuePerDay',
                        type: 'decimal'
                    },
                    {
                        name: "accessories",
                        type: "text",
                        isArray: true,
                        isNullable: true,
                    },
                    {
                        name: 'numberOfPassengers',
                        type: 'int'
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
        await queryRunner.dropTable('cars');
    }

}
