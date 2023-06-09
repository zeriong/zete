import * as Validator from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from '../../../common/dtos/coreOutput.dto';
import { Category } from '../../../entities/category.entity';

export class CateInput {
  @ApiProperty({ type: Number })
  @Validator.IsNumber()
  cateId: number;

  @ApiProperty()
  @Validator.MaxLength(255, {
    message: '카테고리 제목은 최대 255자 까지 가능합니다.',
  })
  @Validator.IsString()
  cateName: string;
}

export class CreateCateInput {
  @ApiProperty()
  @Validator.MaxLength(255, {
    message: '카테고리 제목은 최대 255자 까지 가능합니다.',
  })
  cateName: string;
}

export class CateIdInput {
  @ApiProperty({ nullable: true, type: Number })
  @Validator.IsOptional()
  @Validator.IsNumber()
  cateId?: number;
}

export class CreateCateOutput extends CoreOutput {
  @ApiProperty({ type: Category })
  savedCate?: Category;
}

export class ImportantMemoLengthOutput extends CoreOutput {
  @ApiProperty({ type: Number, required: false })
  importantMemoCount?: number;
}
