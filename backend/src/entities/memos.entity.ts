import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tags } from './tags.entity';
import { User } from './user.entity';
import { coreEntity } from '../common/entities/core.entity';
import { Categories } from './categories.entity';

@Entity({ name: 'memos' })
export class Memos extends coreEntity {
  /** memo title */
  @ApiProperty({ required: false })
  @Column({ type: 'tinytext' }) //tinytext: 	255
  title?: string;

  /** memo content */
  @ApiProperty({ required: false })
  @Column({ type: 'text' }) //text: 	65,535
  content?: string;

  /** user */
  @ApiProperty({ type: Promise<User> })
  @ManyToOne(() => User, (user) => user.memos)
  user: User;

  @ApiProperty({ type: Promise<Categories> })
  @ManyToOne(() => Categories, (categories) => categories.memos)
  @JoinColumn({ name: 'cateId' })
  categories: Categories;

  @ApiProperty({ type: Tags })
  @OneToMany(() => Tags, (tags) => tags.memos, { cascade: true })
  @JoinColumn({ name: 'memoId' })
  tags: Tags[];
}
