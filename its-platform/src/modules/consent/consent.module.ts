import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsentController } from './consent.controller.js';
import { ConsentService } from './consent.service.js';
import { ConsentEntity } from '../../infrastructure/persistence/consent/consent.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ConsentEntity])],
  controllers: [ConsentController],
  providers: [ConsentService],
  exports: [ConsentService],
})
export class ConsentModule {}