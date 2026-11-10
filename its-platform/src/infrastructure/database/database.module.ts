import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { TypeOrmDataSourceFactory } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { createDataSourceOptions } from './data-source.js';

const dataSourceFactory: TypeOrmDataSourceFactory = async options => {
  const dataSource = new DataSource(options as ReturnType<typeof createDataSourceOptions>);
  try {
    await dataSource.initialize();
  } catch (err) {
    // Dev apenas: fora de produção, a aplicação sobe sem PostgreSQL para não travar o boot
    // local (o mesmo espírito do ADR-014 — dev tolerante, produção estrita). Em produção a
    // falha de init continua lançada: um banco ausente tem que ser um defeito alto, não um
    // aviso no console.
    if (process.env['NODE_ENV'] === 'production') throw err;
    console.warn('⚠️  Não foi possível conectar ao PostgreSQL:', (err as Error).message);
    console.warn('⚠️  A aplicação iniciará sem conexão com banco de dados (apenas fora de produção).');
  }
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
