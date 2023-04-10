import { coreEntity } from '../common/entities/core.entity';
import { Column, Entity, OneToMany } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { Memo } from "./memo.entity";

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

  // /** memos */
  // @ApiProperty({ required: false })
  // @Column({ nullable: true })
  // @OneToMany(() => Memo, (memo) => memo.user, { cascade: true })
  // memos?: Memo[];
}
