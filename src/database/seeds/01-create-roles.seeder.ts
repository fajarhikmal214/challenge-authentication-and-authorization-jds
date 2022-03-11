import { Role } from 'src/roles/role.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateRoles implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Role)().createMany(10);
  }
}
