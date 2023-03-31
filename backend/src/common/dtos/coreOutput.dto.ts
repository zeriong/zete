import { ApiProperty } from '@nestjs/swagger';

export class CoreOutput {
  @ApiProperty({ required: false })
  error?: string;

  @ApiProperty({ required: false })
  target?: string;

  @ApiProperty({ type: Boolean })
  success: boolean;
}
