import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Permission } from 'src/models/permissions/permission.entity';
import slugify from 'slugify';

define(Permission, () => {
  const permissionLists =
    faker.random.arrayElement(['create', 'read', 'update', 'delete']) +
    ' ' +
    faker.random.arrayElement([
      'user',
      'role',
      'permission',
      'occupation',
      'Work Unit',
    ]);

  const permission = new Permission();

  permission.name = slugify(permissionLists);
  permission.description = permissionLists;

  return permission;
});
