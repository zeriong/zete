import { ApiProperty } from '@nestjs/swagger';
import * as Validator from 'class-validator';
import { CoreOutput } from '../../../common/dtos/coreOutput.dto';

export class GptRefillInputDto {
  @ApiProperty({ type: Number })
  @Validator.IsNumber()
  gptRefillAt: number;
}

export class GptAvailableOutputDto extends CoreOutput {
  @ApiProperty({ type: Number })
  gptAvailable?: number;

  @ApiProperty({ type: Number })
  gptRefillAt?: number;
}
