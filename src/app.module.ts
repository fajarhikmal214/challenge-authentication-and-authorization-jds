import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './config/config.schema';
import { AuthModule } from './models/auth/auth.module';
import { UserModule } from './models/users/users.module';
import { RoleModule } from './models/roles/roles.module';
import { PermissionModule } from './models/permissions/permissions.module';
import { UserProfileModule } from './models/user-profiles/user-profiles.module';
import { UserSocialAccountModule } from './models/user-social-accounts/user-social-accounts.module';
import { InstitutionModule } from './models/institutions/institution.module';
import { DatabaseConnection } from './config/database-connection.config';
import { CategoryModule } from './models/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnection,
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    UserProfileModule,
    UserSocialAccountModule,
    InstitutionModule,
    CategoryModule,
  ],
})
export class AppModule {}
