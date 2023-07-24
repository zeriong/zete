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
import { Memo } from './memo.entity';
import { Tag } from './tag.entity';

@Entity({ name: 'category' })
export class Category {
  @ApiProperty({ type: Number, required: false, nullable: true })
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id?: number;

  @ApiProperty({ nullable: true, required: false })
  @Column({ type: 'tinytext' }) //tinytext: 	255
  name?: string;

  @ManyToOne(() => User, (user) => user.cate, { onDelete: 'CASCADE' })
  user?: User;
  @ApiProperty({ type: Number })
  @RelationId((cate: Category) => cate.user)
  userId?: number;

  @ApiProperty({ type: [Memo] })
  @OneToMany(() => Memo, (memos) => memos.cate, { cascade: true })
  memo?: Memo[];

  @ApiProperty({ type: [Tag] })
  @OneToMany(() => Tag, (tags) => tags.cate, { cascade: true })
  tag?: Tag[];
}
