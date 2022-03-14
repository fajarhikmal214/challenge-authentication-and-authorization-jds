import 'dotenv/config';
import { ConnectionOptions } from 'typeorm';

const DatabaseConfig: ConnectionOptions & {
  seeds: string[];
  factories: string[];
} = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: ['dist/**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*.{js,ts}'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
  factories: ['dist/database/factories/*.js'],
  seeds: ['dist/database/seeds/*.js'],
};

module.exports = DatabaseConfig;
