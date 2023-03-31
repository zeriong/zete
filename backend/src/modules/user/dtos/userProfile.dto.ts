import { ApiProperty } from '@nestjs/swagger';
import * as Validator from 'class-validator';
import { UserProfile } from '../types/userProfile.type';

export class UserProfileInput {
  @ApiProperty({ type: Number })
  @Validator.IsNumber()
  userId;
}

export class UserProfileOutput {
  @ApiProperty({ type: UserProfile })
  @Validator.IsOptional()
  userProfile: UserProfile;
}
