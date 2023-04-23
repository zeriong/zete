import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
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
  @JoinColumn({ name: 'memoId' })
  memos: Memos;

  @ApiProperty({ type: Promise<Categories> })
  @ManyToOne(() => Categories, (categories) => categories.tags)
  @JoinColumn({ name: 'cateId' })
  categories: Categories;
}
