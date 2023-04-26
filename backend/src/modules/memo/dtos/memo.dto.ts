import * as Validator from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CateIdInputDto } from './cate.dto';
import { Tags } from '../../../entities/tags.entity';
import { Memos } from '../../../entities/memos.entity';
import { CoreOutput } from '../../../common/dtos/coreOutput.dto';

export class CreateMemoInputDto extends CateIdInputDto {
  @ApiProperty()
  @Validator.MaxLength(255, { message: '최대 255자 까지 메모가능합니다.' })
  title: string;

  @ApiProperty()
  @Validator.MaxLength(65535, { message: '최대 65,535자 까지 메모가능합니다.' })
  content: string;

  @ApiProperty({ type: Boolean })
  @Validator.IsBoolean()
  important: boolean;

  @ApiProperty({ type: [String], required: false })
  @Validator.IsArray({ message: '잘못된 태그형식입니다.' })
  tags?: Array<string>;
}

export class MemoIdInputDto {
  @ApiProperty({ type: Number })
  @Validator.IsNumber()
  memoId: number;
}

export class CreateMemoOutDto extends CoreOutput {
  @ApiProperty({ type: Number })
  newMemoId?: number;

  @ApiProperty({ type: [Tags], required: false })
  newTags?: Array<Tags>;
}
