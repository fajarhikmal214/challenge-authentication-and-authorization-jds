import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PermissionTable1647216773250 implements MigrationInterface {
  private tableName = 'permission';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '192',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '192',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${this.tableName}`);
  }
}
