import { Module } from '@nestjs/common';
import { ContentController } from './content.controller.js';
import { ContentService } from './content.service.js';
import { ContentRepository } from '../../infrastructure/repositories/content.repository.js';

@Module({
  controllers: [ContentController],
  providers: [ContentService, ContentRepository],
})
export class ContentModule {}
