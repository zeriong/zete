import { CoreOutput } from '../../../common/dtos/coreOutput.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../../entities/categories.entity';
import { Memo } from '../../../entities/memos.entity';
import { Tag } from '../../../entities/tags.entity';

export class CategoriesAndMemoCount {
  @ApiProperty({ type: Number })
  id?: number;

  @ApiProperty({ nullable: true })
  cateName?: string;

  @ApiProperty({ type: Number })
  userId?: number;

  @ApiProperty({ type: [Memo] })
  memo?: Memo[];

  @ApiProperty({ type: [Tag] })
  tag?: Tag[];

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
