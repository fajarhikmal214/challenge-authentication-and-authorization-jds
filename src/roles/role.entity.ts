import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from '../permissions/permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 192 })
  public name: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    nullable: false,
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    nullable: false,
  })
  public updatedAt: Date;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_has_permission',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  public permissions: Permission[];
}
