import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Tag } from './memoTag.entity';

@Entity({ name: 'MemoCate' })
export class MemoCate {
  /** user */
  // @ManyToOne((type) => User, (user: User) => user.memos)
  @ApiProperty({ type: User })
  user: User;
  @RelationId((memo: MemoCate) => memo.user)
  userId: number;

  /** memo title */
  @ApiProperty()
  @Column({ type: 'tinytext' }) //tinytext: 	255
  title: string;

  /** memo content */
  @ApiProperty({ required: false })
  @Column({ type: 'text' }) //text: 	65,535
  content?: string;

  /** memo tag */
  @ApiProperty({ type: Tag })
  @Column({ length: 128 })
  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable()
  tags: Tag[];
}
