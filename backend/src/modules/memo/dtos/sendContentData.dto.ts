import { CoreOutput } from '../../../common/dtos/coreOutput.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Tags } from '../../../entities/tags.entity';
import { Categories } from '../../../entities/categories.entity';

export class MemoLengthInCate {
  @ApiProperty({ type: Number })
  cateId: number;

  @ApiProperty({ type: Number })
  length: number;
}

export class TagNameAndCateId {
  @ApiProperty({ type: Number })
  cateId: number;

  @ApiProperty()
  tagName: string;
}

export class CateNameAndCateId {
  @ApiProperty({ type: Number })
  cateId: number;

  @ApiProperty()
  cateName: string;
}

export class SendDefaultDataOutputDto extends CoreOutput {
  @ApiProperty({ type: Number, required: false })
  memosLength?: number;

  @ApiProperty({ type: Number, required: false })
  importantMemoLength?: number;

  @ApiProperty({ type: [MemoLengthInCate], required: false })
  memoLengthInCate?: Array<MemoLengthInCate>;

  @ApiProperty({ type: [TagNameAndCateId], required: false })
  tags?: Array<TagNameAndCateId>;

  @ApiProperty({ type: [CateNameAndCateId], required: false })
  cate?: Array<CateNameAndCateId>;
}
