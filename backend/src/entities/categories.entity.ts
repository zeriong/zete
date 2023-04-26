import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { coreEntity } from '../common/entities/core.entity';
import { Memos } from './memos.entity';
import { Tags } from './tags.entity';

@Entity({ name: 'categories' })
export class Categories extends coreEntity {
  @ApiProperty({ nullable: true })
  @Column({ type: 'tinytext' }) //tinytext: 	255
  cateName: string;

  @ApiProperty({ type: Promise<User> })
  @ManyToOne(() => User, (user) => user.cate, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ type: Memos })
  @OneToMany(() => Memos, (memos) => memos.cate, { cascade: true })
  memos: Memos[];

  @ApiProperty({ type: Tags })
  @OneToMany(() => Tags, (tags) => tags.cate, { cascade: true })
  tags: Tags[];
}
