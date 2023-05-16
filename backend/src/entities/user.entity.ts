import { coreEntity } from '../common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.entity';
import { Memo } from './memo.entity';
import { Tag } from './tag.entity';

@Entity({ name: 'user' })
export class User extends coreEntity {
  /** email */
  @ApiProperty()
  @Column({ unique: true, length: 32, comment: '유저 이메일' })
  email: string;

  /** password */
  @ApiProperty()
  @Column({ select: false, length: 128 }) //select할 수 없게 만듦
  password: string;

  /** name */
  @ApiProperty()
  @Column({ length: 32, comment: '유저 이름' })
  name: string;

  /** mobile */
  @ApiProperty()
  @Column({ length: 16, comment: '휴대폰변호' })
  mobile: string;

  /** refreshToken */
  @ApiProperty({ required: false })
  @Column({ nullable: true, type: 'tinytext' })
  refreshToken?: string;

  @ApiProperty({ type: [Category] })
  @OneToMany(() => Category, (categories) => categories.user, {
    cascade: true,
  })
  cate: Category[];

  @ApiProperty({ type: [Memo] })
  @OneToMany(() => Memo, (memos) => memos.user, { cascade: true })
  memo: Memo[];

  @ApiProperty({ type: [Tag] })
  @OneToMany(() => Tag, (tags) => tags.user, { cascade: true })
  tag: Tag[];
}
