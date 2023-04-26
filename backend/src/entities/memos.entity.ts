import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tags } from './tags.entity';
import { User } from './user.entity';
import { coreEntity } from '../common/entities/core.entity';
import { Categories } from './categories.entity';

@Entity({ name: 'memos' })
export class Memos extends coreEntity {
  @ApiProperty({ required: false })
  @Column({ type: 'tinytext' }) //tinytext: 	255
  title: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text' }) //text: 	65,535
  content: string;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'text' }) //text: 	65,535
  important: boolean;

  @ApiProperty({ type: Promise<User> })
  @ManyToOne(() => User, (user) => user.memos, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ nullable: true, type: Promise<Categories> })
  @ManyToOne(() => Categories, (cate) => cate.memos, { onDelete: 'CASCADE' })
  cate: Categories;

  @ApiProperty({ nullable: true, type: Number })
  @RelationId((memo: Memos) => memo.cate)
  cateId: number;

  @ApiProperty({ type: Tags })
  @OneToMany(() => Tags, (tags) => tags.memos, { cascade: true })
  tags: Tags[];
}
