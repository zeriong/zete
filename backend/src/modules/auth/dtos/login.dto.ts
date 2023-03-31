import * as Validator from 'class-validator';
import { User } from '../../../entities/user.entity';
import { CoreOutput } from '../../../common/dtos/coreOutput.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginInput {
  /** email */
  @ApiProperty()
  @Validator.IsEmail({}, { message: '이메일을 입력해 주시기 바랍니다.' })
  email: string;

  /** password */
  @ApiProperty()
  @Validator.Length(8, 100, {
    message: '비밀번호는 최소 8자 이상이어야 합니다.',
  })
  @Validator.IsString()
  password: string;
}

export class LoginOutput extends CoreOutput {
  @ApiProperty({ required: false, type: User })
  user?: User;

  @ApiProperty({ required: false })
  @Validator.IsString()
  accessToken?: string;
}

export class LogOutInput {
  @ApiProperty({ type: Number })
  @Validator.IsNumber()
  userId: number;
}
