import { CoreOutput } from '../../../common/dtos/coreOutput.dto';
import { ApiProperty } from '@nestjs/swagger';
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

export class AsideData {
  @ApiProperty({ type: Number, required: false })
  memosLength?: number;

  @ApiProperty({ type: Number, required: false })
  importantMemoLength?: number;

  @ApiProperty({ type: Number, required: false })
  tagsLength?: number;

  @ApiProperty({ type: [MemoLengthInCate], required: false })
  memoLengthInCate?: Array<MemoLengthInCate>;

  @ApiProperty({ type: [TagNameAndCateId], required: false })
  tagsInCate?: Array<TagNameAndCateId>;

  @ApiProperty({ type: [Categories], required: false })
  cate?: Array<Categories>;
}
export class AsideDataOutput extends CoreOutput {
  @ApiProperty({ type: AsideData, required: false })
  asideData?: AsideData;
}
