import { Controller, Get, Param, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { ContentService } from './content.service.js';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('lessons/:id')
  async getLesson(@Param('id') id: string) {
    const lesson = await this.contentService.getLesson(id);
    if (!lesson) throw new NotFoundException({ error: 'not_found', message: 'Lesson not found', request_id: cryptoRandom() });
    return lesson;
  }

  @Get('packs/:id')
  async getPack(@Param('id') id: string) {
    const pack = await this.contentService.getPack(id);
    if (!pack) throw new NotFoundException({ error: 'not_found', message: 'Pack not found', request_id: cryptoRandom() });
    return pack;
  }

  @Get('listening/:id')
  async getDialogue(@Param('id') id: string) {
    const dialogue = await this.contentService.getDialogue(id);
    if (!dialogue) throw new NotFoundException({ error: 'not_found', message: 'Dialogue not found or status=withdrawn', request_id: cryptoRandom() });
    return dialogue;
  }
}

function cryptoRandom(): string {
  return (globalThis as any).crypto?.randomUUID?.() ?? require('crypto').randomUUID();
}
