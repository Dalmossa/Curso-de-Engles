import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ConsentService } from './consent.service.js';
import { ConsentPurpose } from '#domain/consent/consent-purpose.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('consent')
@Controller('learners/:learner_id/consents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ConsentController {
  constructor(private readonly consent: ConsentService) {}

  @Get()
  @ApiOperation({ summary: 'List all consents for a learner' })
  async list(@Param('learner_id') learnerId: string) {
    const consents = await this.consent.getConsents(learnerId);
    return { consents };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Grant consent for a specific purpose' })
  @ApiParam({ name: 'learner_id', type: 'string', format: 'uuid' })
  async grant(
    @Param('learner_id') learnerId: string,
    @Body() dto: { purpose: ConsentPurpose; ipHash?: string | null; userAgent?: string | null },
  ) {
    return this.consent.grantConsent(learnerId, dto.purpose, dto.ipHash ?? null, dto.userAgent ?? null);
  }

  @Delete(':purpose')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Withdraw consent for a specific purpose (LGPD Art. 8)' })
  @ApiParam({ name: 'learner_id', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'purpose', enum: ConsentPurpose })
  async withdraw(
    @Param('learner_id') learnerId: string,
    @Param('purpose') purpose: ConsentPurpose,
  ) {
    return this.consent.withdrawConsent(learnerId, purpose);
  }
}