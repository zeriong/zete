import { CoreOutput } from '../../../common/dtos/coreOutput.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Categories } from '../../../entities/categories.entity';
import { Memos } from '../../../entities/memos.entity';
import { Tags } from '../../../entities/tags.entity';

export class SendContentDataOutputDto extends CoreOutput {
  @ApiProperty({ type: Categories, required: false })
  cate?: Categories[];

  @ApiProperty({ type: Memos, required: false })
  memos?: Memos[];

  @ApiProperty({ type: Tags, required: false })
  tags?: Tags[];
}
