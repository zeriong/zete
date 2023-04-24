import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from '../../entities/categories.entity';
import { Memos } from '../../entities/memos.entity';
import { Tags } from '../../entities/tags.entity';
import { MemoService } from './memo.service';
import { MemoController } from './memo.controller';
import { User } from '../../entities/user.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Memos, Categories, Tags, User])],
  controllers: [MemoController],
  providers: [MemoService, UserService],
  exports: [MemoService],
})
export class MemoModule {}
