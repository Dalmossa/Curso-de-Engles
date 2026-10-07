export class ErrorResponseDto {
  error!: string;
  message!: string;
  request_id!: string;
  details?: Record<string, any>;
}
