import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class ProblemExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'internal_server_error';
    let message = 'Internal server error';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      if (typeof res === 'object' && res !== null) {
        error = res.error ?? exception.name;
        message = res.message ?? exception.message;
        details = res.details;
      } else {
        message = res;
        error = this.mapStatusToError(status);
      }
    } else {
      message = exception?.message ?? 'Internal server error';
      error = 'internal_server_error';
    }

    const problem = {
      type: `https://httpstatuses.com/${status}`,
      title: error,
      status,
      detail: message,
      instance: request.url,
      request_id: this.generateId(),
      ...(details ? { details } : {}),
    };

    response.status(status).json(problem);
  }

  private mapStatusToError(status: number): string {
    switch (status) {
      case 400: return 'bad_request';
      case 401: return 'unauthorized';
      case 403: return 'forbidden';
      case 404: return 'not_found';
      case 409: return 'conflict';
      case 422: return 'unprocessable_entity';
      case 429: return 'too_many_requests';
      default: return 'internal_server_error';
    }
  }

  private generateId(): string {
    if (typeof globalThis !== 'undefined' && (globalThis as any).crypto?.randomUUID) {
      return (globalThis as any).crypto.randomUUID();
    }
    return '00000000-0000-4000-8000-000000000000';
  }
}
