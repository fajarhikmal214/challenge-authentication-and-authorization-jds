import { Institution } from 'src/models/institutions/institution.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateInstitutions implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Institution)().createMany(10);
  }
}
