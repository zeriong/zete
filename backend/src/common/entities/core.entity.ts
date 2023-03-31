import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class coreEntity {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  createAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updateAt: Date;
}
