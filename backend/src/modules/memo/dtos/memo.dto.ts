import * as Validator from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CateIdInput } from './cate.dto';
import { Tags } from '../../../entities/tags.entity';
import { Memos } from '../../../entities/memos.entity';
import { CoreOutput } from '../../../common/dtos/coreOutput.dto';

export class TagNameInput {
  @ApiProperty()
  @Validator.IsOptional()
  @Validator.IsString()
  tagName: string;
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
  tags?: Array<TagNameInput>;
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

export class CreateMemoNewTagsOutput {
  @ApiProperty({ type: Number })
  tagId: number;

  @ApiProperty({ type: Number })
  cateId: number;

  @ApiProperty({ type: Number })
  memoId: number;

  @ApiProperty()
  tagName: string;
}

export class CreateMemoOutput extends CoreOutput {
  @ApiProperty({ type: Number })
  newMemoId?: number;

  @ApiProperty({ type: Date })
  updateAt?: Date;

  @ApiProperty({ type: [CreateMemoNewTagsOutput] })
  newTags?: Array<CreateMemoNewTagsOutput>;
}

export class GetMemosTags {
  @ApiProperty({ type: Number })
  memoId: number;

  @ApiProperty({ type: Number })
  cateId: number;

  @ApiProperty({ type: Number })
  tagId: number;

  @ApiProperty()
  tagName: string;
}

export class GetMemos {
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

  @ApiProperty({ type: [GetMemosTags] })
  tags: Array<GetMemosTags>;
}

export class GetMemosOutput extends CoreOutput {
  @ApiProperty({ type: [GetMemos] })
  memos?: Array<GetMemos>;

  @ApiProperty({ type: Number })
  memosLength?: number;

  @ApiProperty({ type: Number })
  importantMemoLength?: number;

  @ApiProperty({ type: Number })
  tagsLength?: number;
}
