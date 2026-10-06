import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { TypeOrmDataSourceFactory } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { createDataSourceOptions } from './data-source.js';

const dataSourceFactory: TypeOrmDataSourceFactory = async options => {
  const dataSource = new DataSource(options as ReturnType<typeof createDataSourceOptions>);
  await dataSource.initialize();
  return dataSource;
};

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => createDataSourceOptions(config),
      inject: [ConfigService],
      dataSourceFactory,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
