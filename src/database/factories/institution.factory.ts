import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Institution } from 'src/models/institutions/institution.entity';

define(Institution, () => {
  const institution = new Institution();

  institution.name = faker.company.companyName();
  institution.description = faker.lorem.paragraph();

  return institution;
});
