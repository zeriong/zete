import * as Validator from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Memos } from '../../../entities/memos.entity';
import { CoreOutput } from '../../../common/dtos/coreOutput.dto';
import { Tags } from '../../../entities/tags.entity';
import { CateIdInput } from './cate.dto';
import { CategoriesAndMemoCount } from './asideData.dto';

export class TagNameInput {
  @ApiProperty()
  @Validator.IsOptional()
  @Validator.IsString()
  tagName?: string;
}

export class MemoIdInput {
  @ApiProperty({ type: Number })
  @Validator.IsNumber()
  memoId: number;
}

export class GetMemosInput {
  @ApiProperty({ nullable: true })
  @Validator.IsOptional()
  @Validator.IsString()
  search?: string;

  @ApiProperty({ type: Number, default: 0 })
  @Validator.IsNumber()
  offset: number;

  @ApiProperty({ type: Number, default: 15 })
  @Validator.IsNumber()
  limit: number;

  @ApiProperty({ type: Number, nullable: true })
  @Validator.IsOptional()
  @Validator.IsNumber()
  cateQueryStr?: number;

  @ApiProperty({ nullable: true })
  @Validator.IsOptional()
  @Validator.IsString()
  tagQueryStr?: string;

  @ApiProperty({ nullable: true })
  @Validator.IsOptional()
  @Validator.IsString()
  menuQueryStr?: string;
}

export class CreateMemoInput extends CateIdInput {
  @ApiProperty()
  @Validator.MaxLength(255, { message: '최대 255자 까지 메모가능합니다.' })
  title: string;

  @ApiProperty()
  @Validator.MaxLength(65535, { message: '최대 65,535자 까지 메모가능합니다.' })
  content: string;

  @ApiProperty({ type: Boolean })
  @Validator.IsBoolean()
  important: boolean;

  @ApiProperty({ type: [TagNameInput], required: false })
  @Validator.IsArray({ message: '잘못된 태그형식입니다.' })
  tags?: TagNameInput[];
}

export class CreateMemoOutput extends CoreOutput {
  @ApiProperty({ type: Memos })
  savedMemo?: Memos;
}

export class GetMemosOutput extends CoreOutput {
  @ApiProperty({ type: [Memos] })
  memos?: Memos[];

  @ApiProperty({ type: Number })
  memosCount?: number;

  @ApiProperty({ type: Number })
  importantMemoCount?: number;

  @ApiProperty({ type: [CategoriesAndMemoCount] })
  cate?: CategoriesAndMemoCount[];
}

export class GetOneMemoOutput extends CoreOutput {
  @ApiProperty({ type: Memos })
  memo?: Memos;
}

export class UpdateMemoObject {
  @ApiProperty({ type: Number })
  @Validator.IsNumber()
  id: number;

  @ApiProperty({ required: false })
  @Validator.IsOptional()
  @Validator.IsString()
  title?: string;

  @ApiProperty({ type: Boolean })
  @Validator.IsBoolean()
  important: boolean;

  @ApiProperty({ required: false })
  @Validator.IsOptional()
  @Validator.IsString()
  content?: string;

  @ApiProperty({ nullable: true })
  @Validator.IsOptional()
  @Validator.IsNumber()
  cateId?: number | null;
}

export class UpdateMemoInput {
  @ApiProperty({ type: UpdateMemoObject })
  @Validator.IsObject()
  memo?: UpdateMemoObject;

  @ApiProperty({ type: [Tags] })
  @Validator.IsArray({ message: '잘못된 태그형식입니다.' })
  newTags?: Tags[];

  @ApiProperty({ type: [Number] })
  @Validator.IsArray({ message: '잘못된 태그형식입니다.' })
  deleteTagIds?: number[];
}
