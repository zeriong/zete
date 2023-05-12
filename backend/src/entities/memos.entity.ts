import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tags } from './tags.entity';
import { User } from './user.entity';
import { coreEntity } from '../common/entities/core.entity';
import { Categories } from './categories.entity';

@Entity({ name: 'memos' })
export class Memos extends coreEntity {
  @ApiProperty({ required: false })
  @Column({ type: 'varchar', length: 64 })
  title: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text' }) //text: 	65,535
  content: string;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'boolean' }) //text: 	65,535
  important: boolean;

  @ManyToOne(() => User, (user) => user.memos, { onDelete: 'CASCADE' })
  user: User;
  @ApiProperty({ type: Number })
  @RelationId((memos: Memos) => memos.user)
  userId: number;

  @ManyToOne(() => Categories, (cate) => cate.memo, { onDelete: 'CASCADE' })
  cate: Categories;
  @ApiProperty({ nullable: true, type: Number })
  @RelationId((memo: Memos) => memo.cate)
  cateId: number;

  @ApiProperty({ type: [Tags] })
  @OneToMany(() => Tags, (tags) => tags.memo, { cascade: true })
  tag: Tags[];
}
