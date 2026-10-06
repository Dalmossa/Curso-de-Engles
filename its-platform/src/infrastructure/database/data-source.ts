import type { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean;
  synchronize: boolean;
  logging: boolean;
}

export const createDataSourceOptions = (config: ConfigService): DataSourceOptions => {
  const dbConfig: DatabaseConfig = {
    host: config.get<string>('DB_HOST') ?? 'localhost',
    port: config.get<number>('DB_PORT') ?? 5432,
    username: config.get<string>('DB_USERNAME') ?? 'postgres',
    password: config.get<string>('DB_PASSWORD') ?? 'postgres',
    database: config.get<string>('DB_NAME') ?? 'its_platform',
    ssl: config.get<boolean>('DB_SSL') ?? false,
    synchronize: config.get<boolean>('DB_SYNCHRONIZE') ?? false,
    logging: config.get<boolean>('DB_LOGGING') ?? false,
  };

  const options: DataSourceOptions = {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
    synchronize: dbConfig.synchronize,
    logging: dbConfig.logging,
    entities: ['dist/**/*.entity{.js,.ts}'],
    migrations: ['dist/migrations/*{.js,.ts}'],
    subscribers: [],
    extra: {
      max: config.get<number>('DB_POOL_MAX') ?? 20,
      idle_timeout: 30000,
      connection_timeout: 5000,
    },
  };

  return options;
};

export const createDataSource = (config: ConfigService): DataSource => {
  return new DataSource(createDataSourceOptions(config));
};

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'its_platform',
  synchronize: false,
  logging: false,
  entities: ['dist/**/*.entity{.js,.ts}'],
  migrations: ['dist/migrations/*{.js,.ts}'],
});
