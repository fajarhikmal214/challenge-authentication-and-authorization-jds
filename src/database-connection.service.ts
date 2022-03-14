import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as DatabaseConfig from './config/database.config';

@Injectable()
export class DatabaseConnectionService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return DatabaseConfig;
  }
}
