import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { coreEntity } from '../common/entities/core.entity';
import { Memos } from './memos.entity';
import { Tags } from './tags.entity';

@Entity({ name: 'categories' })
export class Categories {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @ApiProperty({ nullable: true })
  @Column({ type: 'tinytext' }) //tinytext: 	255
  cateName: string;

  @ManyToOne(() => User, (user) => user.cate, { onDelete: 'CASCADE' })
  user: User;
  @ApiProperty({ type: Number })
  @RelationId((cate: Categories) => cate.user)
  userId: number;

  @ApiProperty({ type: Memos })
  @OneToMany(() => Memos, (memos) => memos.cate, { cascade: true })
  memo: Memos[];

  @ApiProperty({ type: Tags })
  @OneToMany(() => Tags, (tags) => tags.cate, { cascade: true })
  tag: Tags[];
}
