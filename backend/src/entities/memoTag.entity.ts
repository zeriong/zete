import { Entity, Column, ManyToMany } from 'typeorm';
import { Memo } from './memo.entity';

@Entity()
export class Tag {
  @Column()
  tagName: string;

  @ManyToMany(() => Memo, (memo) => memo.tags)
  Memos: Memo[];
}
