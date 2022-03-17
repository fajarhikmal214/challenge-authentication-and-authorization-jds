import { Permission } from 'src/permissions/permission.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreatePermissions implements Seeder {
  public async run(factory: Factory): Promise<any> {
    // await factory(Permission)().createMany(200);
  }
}
