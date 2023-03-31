import * as Validator from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCompletionDto {
  @ApiProperty()
  @Validator.IsString()
  question: string;

  @ApiProperty({ required: false })
  @Validator.IsString()
  model?: string;

  @ApiProperty({ required: false })
  @Validator.IsNumber()
  temperature?: number;
}
