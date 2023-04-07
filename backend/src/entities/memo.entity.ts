import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tag } from './memoTag.entity';

@Entity({ name: 'memo' })
export class Memo {
  /** memo title */
  @ApiProperty()
  @Column({ length: 200 })
  title: string;

  /** memo content */
  @ApiProperty({ required: false })
  @Column({ length: 1000 })
  content?: string;

  /** memo tag */
  @ApiProperty()
  @Column({ length: 128 })
  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable()
  tags: Tag[];
}
