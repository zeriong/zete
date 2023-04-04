import * as Validator from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCompletionInputObj {
  @ApiProperty()
  @Validator.IsString()
  role: string;

  @ApiProperty()
  @Validator.IsString()
  content: string;
}

export class CreateCompletionInputDto {
  @ApiProperty({ type: CreateCompletionInputObj })
  @Validator.IsArray()
  data: CreateCompletionInputObj[];
}
