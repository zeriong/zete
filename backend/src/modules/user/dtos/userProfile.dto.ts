import { ApiProperty } from '@nestjs/swagger';
import * as Validator from 'class-validator';

export class UserProfileInput {
  @ApiProperty({ type: Number })
  @Validator.IsNumber()
  userId;
}