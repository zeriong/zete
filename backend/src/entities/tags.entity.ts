import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import { Memos } from './memos.entity';
import { coreEntity } from '../common/entities/core.entity';
import { Categories } from './categories.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity({ name: 'tags' })
export class Tags extends coreEntity {
  @ApiProperty()
  @Column()
  tagName: string;

  @ApiProperty({ type: Promise<User> })
  @ManyToOne(() => User, (user) => user.tags)
  user: User;

  @ApiProperty({ type: Promise<Memos> })
  @ManyToOne(() => Memos, (memo) => memo.tags)
  memos: Memos;

  @ApiProperty({ type: Number })
  @RelationId((tags: Tags) => tags.memos)
  memoId: number;

  @ApiProperty({ type: Promise<Categories> })
  @ManyToOne(() => Categories, (cate) => cate.tags)
  cate: Categories;

  @ApiProperty({ type: Number })
  @RelationId((tags: Tags) => tags.cate)
  cateId: number;
}
