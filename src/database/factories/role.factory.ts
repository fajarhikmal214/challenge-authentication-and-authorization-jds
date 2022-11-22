import { Role } from 'src/models/roles/role.entity';
import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';

define(Role, () => {
  const role = new Role();

  role.name = faker.name.jobTitle();

  return role;
});
