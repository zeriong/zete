import * as Validator from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from '../../../common/dtos/coreOutput.dto';
import { Categories } from '../../../entities/categories.entity';

export class CateInputDto {
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

export class CreateCateInputDto {
  @ApiProperty()
  @Validator.MaxLength(255, {
    message: '카테고리 제목은 최대 255자 까지 가능합니다.',
  })
  cateName: string;
}

export class CateIdInputDto {
  @ApiProperty({ nullable: true, type: Number })
  @Validator.IsOptional()
  @Validator.IsNumber()
  cateId?: number;
}

export class CreateCateOutputDto extends CoreOutput {
  @ApiProperty({ type: Categories, required: false })
  cate?: Categories[];

  @ApiProperty({ type: CateInputDto })
  savedCate?: CateInputDto;
}

export class DeleteCateOutputDto extends CoreOutput {
  @ApiProperty({ type: Number, required: false })
  importantMemoLength?: number;
}

export class UpdateManyCateInputDto {
  @ApiProperty({ type: [CateInputDto] })
  @Validator.IsArray({ message: '잘못된 형식입니다.' })
  data: Array<CateInputDto>;
}
