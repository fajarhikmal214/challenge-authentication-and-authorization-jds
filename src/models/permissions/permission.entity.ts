import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 192, nullable: false })
  public name: string;

  @Column({ type: 'varchar', length: 192, nullable: false })
  public description: string;
}
