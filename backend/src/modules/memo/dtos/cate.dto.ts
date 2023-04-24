import * as Validator from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from '../../../common/dtos/coreOutput.dto';
import { Categories } from '../../../entities/categories.entity';
import { Type } from 'class-transformer';

export class CreateCateDto {
  @ApiProperty()
  @Validator.MaxLength(255, {
    message: '카테고리 제목은 최대 255자 까지 가능합니다.',
  })
  cateName: string;
}

export class CreateCateOutputDto extends CoreOutput {
  @ApiProperty({ type: Categories, required: false })
  cate?: Categories[];
}

export class UpdateOneCateInputDto {
  @ApiProperty()
  @Validator.MaxLength(255, {
    message: '카테고리 제목은 최대 255자 까지 가능합니다.',
  })
  cateName: string;

  @ApiProperty({ type: Number })
  cateId: number;
}

export class IUpdateManyCateInput {
  @ApiProperty({ type: Number })
  @Validator.IsNumber()
  cateId: number;

  @ApiProperty()
  @Validator.IsString()
  cateName: string;
}
export class UpdateManyCateInputDto {
  @ApiProperty({ type: [IUpdateManyCateInput] })
  @Validator.IsArray()
  data: Array<IUpdateManyCateInput>;
}
