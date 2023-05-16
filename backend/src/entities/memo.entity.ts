import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tag } from './tag.entity';
import { User } from './user.entity';
import { coreEntity } from '../common/entities/core.entity';
import { Category } from './category.entity';

@Entity({ name: 'memo' })
export class Memo extends coreEntity {
  @ApiProperty({ required: false })
  @Column({ type: 'varchar', length: 64 })
  title: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text' }) //text: 	65,535
  content: string;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'boolean' }) //text: 	65,535
  important: boolean;

  @ManyToOne(() => User, (user) => user.memo, { onDelete: 'CASCADE' })
  user: User;
  @ApiProperty({ type: Number, required: false })
  @RelationId((memos: Memo) => memos.user)
  userId: number;

  @ManyToOne(() => Category, (cate) => cate.memo, { onDelete: 'CASCADE' })
  cate: Category;
  @ApiProperty({ nullable: true, type: Number })
  @RelationId((memo: Memo) => memo.cate)
  cateId: number;

  @ApiProperty({ type: [Tag], required: false })
  @OneToMany(() => Tag, (tags) => tags.memo, { cascade: true })
  tag: Tag[];
}
