import { ApiProperty } from '@nestjs/swagger';
import * as Validator from 'class-validator';
import { CoreOutput } from '../../../common/dtos/coreOutput.dto';

export class ResetGptDailyLimitInputDto {
  @ApiProperty({ type: Number })
  @Validator.IsNumber()
  gptDailyResetDate: number;
}

export class ResetGptDailyLimitOutputDto extends CoreOutput {
  @ApiProperty({ type: Number, required: false })
  gptDailyLimit?: number;

  @ApiProperty({ type: Number, required: false })
  gptDailyResetDate?: number;
}
