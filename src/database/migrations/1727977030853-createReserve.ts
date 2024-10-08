import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateReserve1727977030853 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'reserves',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                    },
                    {
                        name: 'startDate',
                        type: 'date',
                    },
                    {
                        name: 'endDate',
                        type: 'date',
                    },
                    {
                        name: 'finalValue',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                    },
                    {
                        name: 'car_id',
                        type: 'uuid',
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
        );

        await queryRunner.createForeignKey('reserves', new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey('reserves', new TableForeignKey({
                columnNames: ['car_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'cars',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('reserves');
    }

}
