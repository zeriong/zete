import { Column, Entity, JoinTable, ManyToMany, ManyToOne, RelationId } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { Tag } from './memoTag.entity';
import { User } from './user.entity';
import { coreEntity } from "../common/entities/core.entity";

@Entity({ name: 'memo' })
export class Memo extends coreEntity {
  /** user */
  @ApiProperty({ type: User })
  // @ManyToOne((type) => User, (user: User) => user.memos)
  user: User;
  @RelationId((memo: Memo) => memo.user)
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
