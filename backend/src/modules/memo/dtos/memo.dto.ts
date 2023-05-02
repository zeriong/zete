import * as Validator from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CateIdInputDto } from './cate.dto';
import { Tags } from '../../../entities/tags.entity';
import { Memos } from '../../../entities/memos.entity';
import { CoreOutput } from '../../../common/dtos/coreOutput.dto';

export class TagNameInputDto {
  @ApiProperty()
  @Validator.IsOptional()
  @Validator.IsString()
  tagName: string;
}

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

  @ApiProperty({ type: [TagNameInputDto], required: false })
  @Validator.IsArray({ message: '잘못된 태그형식입니다.' })
  tags?: Array<TagNameInputDto>;
}

export class MemoIdInputDto {
  @ApiProperty({ type: Number })
  @Validator.IsNumber()
  memoId: number;
}

export class PaginationInputDto {
  @ApiProperty({ type: Number })
  @Validator.IsNumber()
  offset: number;

  @ApiProperty({ type: Number })
  @Validator.IsNumber()
  limit: number;

  @ApiProperty({ type: Number })
  @Validator.IsOptional()
  @Validator.IsNumber()
  cateQueryStr?: number;

  @ApiProperty()
  @Validator.IsOptional()
  @Validator.IsString()
  tagQueryStr?: string;

  @ApiProperty()
  @Validator.IsOptional()
  @Validator.IsString()
  menuQueryStr?: string;
}

export class CreateMemoNewTagsOutputDto {
  @ApiProperty({ type: Number })
  tagId: number;

  @ApiProperty({ type: Number })
  cateId: number;

  @ApiProperty({ type: Number })
  memoId: number;

  @ApiProperty()
  tagName: string;
}

export class CreateMemoOutputDto extends CoreOutput {
  @ApiProperty({ type: Number })
  newMemoId?: number;

  @ApiProperty({ type: Date })
  updateAt?: Date;

  @ApiProperty({ type: [CreateMemoNewTagsOutputDto] })
  newTags?: Array<CreateMemoNewTagsOutputDto>;
}

export class PaginationTagsDto {
  @ApiProperty({ type: Number })
  memoId: number;

  @ApiProperty({ type: Number })
  cateId: number;

  @ApiProperty({ type: Number })
  tagId: number;

  @ApiProperty()
  tagName: string;
}

export class PaginationMemosDto {
  @ApiProperty({ type: Number })
  memoId: number;

  @ApiProperty({ type: Number })
  cateId: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  updateAt: Date;

  @ApiProperty({ type: Boolean })
  important: boolean;

  @ApiProperty({ type: [PaginationTagsDto] })
  tags: Array<PaginationTagsDto>;
}

export class PaginationOutputDto extends CoreOutput {
  @ApiProperty({ type: [PaginationMemosDto], required: false })
  memos?: Array<PaginationMemosDto>;
}
