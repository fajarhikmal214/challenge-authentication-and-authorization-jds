import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class RoleHasPermissionTable1647216795289 implements MigrationInterface {
  private tableName = 'role_has_permission';
  private roleTableName = 'role';
  private permissionTableName = 'permission';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'role_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'permission_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: this.roleTableName,
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['permission_id'],
        referencedColumnNames: ['id'],
        referencedTableName: this.permissionTableName,
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const thisTable = await queryRunner.getTable(this.tableName);

    const roleIdForeignKey = thisTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('role_id') !== -1,
    );
    const permissionIdForeignKey = thisTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('permission_id') !== -1,
    );

    await queryRunner.dropForeignKey(this.tableName, roleIdForeignKey);
    await queryRunner.dropForeignKey(this.tableName, permissionIdForeignKey);
    await queryRunner.dropTable(this.tableName);
  }
}
