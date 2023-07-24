import {
  Entity,
  Column,
  ManyToOne,
  RelationId,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Memo } from './memo.entity';
import { Category } from './category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity({ name: 'tag' })
export class Tag {
  @ApiProperty({ type: Number, required: false })
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id?: number;

  @ApiProperty({ required: false })
  @Column()
  name?: string;

  @ManyToOne(() => User, (user) => user.tag, { onDelete: 'CASCADE' })
  user?: User;
  @ApiProperty({ type: Number, required: false })
  @RelationId((tags: Tag) => tags.user)
  userId?: number;

  @ManyToOne(() => Memo, (memo) => memo.tag, { onDelete: 'CASCADE' })
  memo?: Memo;
  @ApiProperty({ type: Number, required: false })
  @RelationId((tags: Tag) => tags.memo)
  memoId?: number;

  @ManyToOne(() => Category, (cate) => cate.tag, { onDelete: 'CASCADE' })
  cate?: Category;
  @ApiProperty({ type: Number, nullable: true, required: false })
  @RelationId((tags: Tag) => tags.cate)
  cateId?: number;
}
