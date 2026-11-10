import type { ContentRepository, DialogueAudio, DialogueContent, LessonContent, PackContent } from '@/core';
import type { ApiTransport } from '../api-transport';
import {
  toDialogueAudio,
  toDialogueContent,
  toLessonContent,
  toPackContent,
  type DialogueAudioDto,
  type DialogueContentDto,
  type LessonContentDto,
  type PackContentDto,
} from '../mappers';

export class HttpContentRepository implements ContentRepository {
  constructor(private readonly _transport: ApiTransport) {}

  async getLesson(lessonId: string): Promise<LessonContent> {
    const dto = await this._transport.request<LessonContentDto>({
      operation: 'content.lesson',
      pathParams: { lesson_id: lessonId },
    });
    return toLessonContent(dto);
  }

  async getPack(packId: string): Promise<PackContent> {
    const dto = await this._transport.request<PackContentDto>({
      operation: 'content.pack',
      pathParams: { pack_id: packId },
    });
    return toPackContent(dto);
  }

  async getDialogue(dialogueId: string): Promise<DialogueContent> {
    const dto = await this._transport.request<DialogueContentDto>({
      operation: 'content.dialogue',
      pathParams: { dialogue_id: dialogueId },
    });
    return toDialogueContent(dto);
  }

  async getDialogueAudio(dialogueId: string, rate: 1 | 0.75 = 1): Promise<DialogueAudio> {
    const dto = await this._transport.request<DialogueAudioDto>({
      operation: 'content.dialogueAudio',
      pathParams: { dialogue_id: dialogueId },
      query: { rate },
    });
    return toDialogueAudio(dto);
  }
}
