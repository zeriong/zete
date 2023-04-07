import { Entity, Column, ManyToMany } from 'typeorm';
import { Memo } from './memo.entity';

@Entity()
export class Tag {
  @Column()
  name: string;

  @ManyToMany(() => Memo, (memo) => memo.tags)
  posts: Memo[];
}
