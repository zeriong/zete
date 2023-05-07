import {
  Entity,
  Column,
  ManyToOne,
  RelationId,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Memos } from './memos.entity';
import { coreEntity } from '../common/entities/core.entity';
import { Categories } from './categories.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity({ name: 'tags' })
export class Tags {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @ApiProperty()
  @Column()
  tagName: string;

  @ManyToOne(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
  user: User;
  @ApiProperty({ type: Number })
  @RelationId((tags: Tags) => tags.user)
  userId: number;

  @ManyToOne(() => Memos, (memo) => memo.tag, { onDelete: 'CASCADE' })
  memo: Memos;
  @ApiProperty({ type: Number })
  @RelationId((tags: Tags) => tags.memo)
  memoId: number;

  @ManyToOne(() => Categories, (cate) => cate.tag, { onDelete: 'CASCADE' })
  cate: Categories;
  @ApiProperty({ type: Number })
  @RelationId((tags: Tags) => tags.cate)
  cateId: number;
}
