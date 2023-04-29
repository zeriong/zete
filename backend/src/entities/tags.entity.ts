import { Entity, Column, ManyToOne, RelationId, JoinColumn } from 'typeorm';
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
  @ManyToOne(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ type: Number })
  @RelationId((tags: Tags) => tags.user)
  userId: number;

  @ApiProperty({ type: Promise<Memos> })
  @ManyToOne(() => Memos, (memo) => memo.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'memoId' })
  memos: Memos;

  @ApiProperty({ type: Number })
  @RelationId((tags: Tags) => tags.memos)
  memoId: number;

  @ApiProperty({ type: Promise<Categories> })
  @ManyToOne(() => Categories, (cate) => cate.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cateId' })
  cate: Categories;

  @ApiProperty({ type: Number })
  @RelationId((tags: Tags) => tags.cate)
  cateId: number;
}
