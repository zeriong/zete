import { coreEntity } from '../common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Categories } from './categories.entity';
import { Memos } from './memos.entity';
import { Tags } from './tags.entity';

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

  @ApiProperty({ type: Categories })
  @OneToMany(() => Categories, (categories) => categories.user)
  cate: Categories[];

  @ApiProperty({ type: Memos })
  @OneToMany(() => Memos, (memos) => memos.user)
  memos: Memos[];

  @ApiProperty({ type: Tags })
  @OneToMany(() => Tags, (tags) => tags.user)
  tags: Tags[];
}
