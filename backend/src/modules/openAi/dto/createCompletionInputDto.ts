import * as Validator from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from '../../../common/dtos/coreOutput.dto';
import { IsOptional } from 'class-validator';

export class CreateCompletionInputDto {
  @ApiProperty()
  @Validator.IsString()
  content: string;
}

export class CreateCompletionOutputDto extends CoreOutput {
  @ApiProperty()
  resGpt?: string;

  @ApiProperty({ type: Number })
  gptAvailable?: number;
}
