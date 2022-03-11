import { UserProfile } from 'src/user-profiles/user-profile.entity';
import { User } from 'src/users/user.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { createQueryBuilder } from 'typeorm';
import { Institution } from 'src/institutions/institution.entity';

export default class CreateUserProfiles implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const users = await createQueryBuilder()
      .select('id')
      .from(User, 'user')
      .execute();
    const institutions = await createQueryBuilder()
      .select('id')
      .from(Institution, 'institution')
      .execute();

    for (const user of users) {
      const RandomInstitutionIndex = Math.floor(
        Math.random() * institutions.length,
      );

      await factory(UserProfile)().create({
        user,
        institution: institutions[RandomInstitutionIndex],
      });
    }
  }
}
