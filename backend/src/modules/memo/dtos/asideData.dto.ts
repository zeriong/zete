import { CoreOutput } from '../../../common/dtos/coreOutput.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Memo } from '../../../entities/memo.entity';
import { Tag } from '../../../entities/tag.entity';

export class CategoriesAndMemoCount {
  @ApiProperty({ type: Number, required: false })
  id?: number;

  @ApiProperty({ nullable: true, required: false })
  name?: string;

  @ApiProperty({ type: Number, required: false })
  userId?: number;

  @ApiProperty({ type: [Memo], required: false })
  memo?: Memo[];

  @ApiProperty({ type: [Tag], required: false })
  tag?: Tag[];

  @ApiProperty({ type: Number, required: false })
  memoCount?: number;
}

export class AsideData {
  @ApiProperty({ type: Number, required: false })
  memosCount?: number;

  @ApiProperty({ type: Number, required: false })
  importantMemoCount?: number;

  @ApiProperty({ type: Number, required: false })
  cateCount?: number;

  @ApiProperty({ type: [CategoriesAndMemoCount], required: false })
  cate?: CategoriesAndMemoCount[];
}
export class AsideDataOutput extends CoreOutput {
  @ApiProperty({ type: AsideData, required: false })
  asideData?: AsideData;
}
