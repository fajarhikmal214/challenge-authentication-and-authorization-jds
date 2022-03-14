import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './config.schema';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { RoleModule } from './roles/roles.module';
import { PermissionModule } from './permissions/permissions.module';
import { UserProfileModule } from './user-profiles/user-profiles.module';
import { UserSocialAccountModule } from './user-social-accounts/user-social-accounts.module';
import { InstitutionModule } from './institutions/institution.module';
import { DatabaseConnectionService } from './database-connection.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    UserProfileModule,
    UserSocialAccountModule,
    InstitutionModule,
  ],
})
export class AppModule {}
