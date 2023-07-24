import * as Validator from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Memo } from '../../../entities/memo.entity';
import { CoreOutput } from '../../../common/dtos/coreOutput.dto';
import { Tag } from '../../../entities/tag.entity';
import { CateIdInput } from './cate.dto';
import { CategoriesAndMemoCount } from './asideData.dto';

export class TagNameInput {
  @ApiProperty({ required: false })
  @Validator.IsOptional()
  @Validator.IsString()
  name?: string;
}

export class MemoIdInput {
  @ApiProperty({ type: Number })
  @Validator.IsNumber()
  memoId: number;
}

export class GetMemosInput {
  @ApiProperty({ nullable: true, required: false })
  @Validator.IsOptional()
  @Validator.IsString()
  search?: string;

  @ApiProperty({ type: Number, default: 0 })
  @Validator.IsNumber()
  offset: number;

  @ApiProperty({ type: Number, default: 15 })
  @Validator.IsNumber()
  limit: number;

  @ApiProperty({ type: Number, nullable: true, required: false })
  @Validator.IsOptional()
  @Validator.IsNumber()
  cateQueryStr?: number;

  @ApiProperty({ nullable: true, required: false })
  @Validator.IsOptional()
  @Validator.IsString()
  tagQueryStr?: string;

  @ApiProperty({ nullable: true, required: false })
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
  @ApiProperty({ type: Memo, required: false })
  savedMemo?: Memo;
}

export class GetMemosOutput extends CoreOutput {
  @ApiProperty({ type: [Memo], required: false })
  memos?: Memo[];

  @ApiProperty({ type: Number, required: false })
  memosCount?: number;

  @ApiProperty({ type: Number, required: false })
  importantMemoCount?: number;

  @ApiProperty({ type: [CategoriesAndMemoCount], required: false })
  cate?: CategoriesAndMemoCount[];
}

export class GetOneMemoOutput extends CoreOutput {
  @ApiProperty({ type: Memo, required: false })
  memo?: Memo;
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

  @ApiProperty({ nullable: true, required: false })
  @Validator.IsOptional()
  @Validator.IsNumber()
  cateId?: number | null;
}

export class UpdateMemoInput {
  @ApiProperty({ type: UpdateMemoObject, required: false })
  @Validator.IsObject()
  memo?: UpdateMemoObject;

  @ApiProperty({ type: [Tag], required: false })
  @Validator.IsArray({ message: '잘못된 태그형식입니다.' })
  newTags?: Tag[];

  @ApiProperty({ type: [Number], required: false })
  @Validator.IsArray({ message: '잘못된 태그형식입니다.' })
  deleteTagIds?: number[];
}
