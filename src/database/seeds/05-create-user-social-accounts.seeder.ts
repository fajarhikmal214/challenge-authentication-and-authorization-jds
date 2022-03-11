import { User } from 'src/users/user.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { createQueryBuilder } from 'typeorm';
import { UserSocialAccount } from 'src/user-social-accounts/user-social-account.entity';

export default class CreateUserSocialAccounts implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const providerName = ['facebook', 'google', 'github', 'keyclock'];
    const users = await createQueryBuilder()
      .select('id')
      .from(User, 'user')
      .execute();

    for (const user of users) {
      for (let i = 0; i < Math.floor(Math.random() * 4) + 1; i++) {
        await factory(UserSocialAccount)().create({
          providerName: providerName[i],
          user,
        });
      }
    }
  }
}
