import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DatabaseConfig: TypeOrmModuleOptions & {
  seeds: string[];
  factories: string[];
} = {
  type: 'postgres',
  synchronize: true,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
  factories: ['dist/database/factories/**/*.js'],
  seeds: ['dist/database/seeds/**/*.js'],
};

module.exports = DatabaseConfig;
