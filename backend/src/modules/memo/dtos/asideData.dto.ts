import { CoreOutput } from '../../../common/dtos/coreOutput.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Categories } from '../../../entities/categories.entity';
import { Memos } from '../../../entities/memos.entity';
import { Tags } from '../../../entities/tags.entity';

export class CategoriesAndMemoCount {
  @ApiProperty({ type: Number })
  id?: number;

  @ApiProperty({ nullable: true })
  cateName?: string;

  @ApiProperty({ type: Number })
  userId?: number;

  @ApiProperty({ type: [Memos] })
  memo?: Memos[];

  @ApiProperty({ type: [Tags] })
  tag?: Tags[];

  @ApiProperty({ type: Number, required: false })
  memoCount?: number;
}

export class AsideData {
  @ApiProperty({ type: Number })
  memosCount?: number;

  @ApiProperty({ type: Number })
  importantMemoCount?: number;

  @ApiProperty({ type: Number })
  cateCount?: number;

  @ApiProperty({ type: [CategoriesAndMemoCount] })
  cate?: CategoriesAndMemoCount[];
}
export class AsideDataOutput extends CoreOutput {
  @ApiProperty({ type: AsideData })
  asideData?: AsideData;
}
