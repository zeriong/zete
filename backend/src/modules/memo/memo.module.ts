import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../entities/categories.entity';
import { Memo } from '../../entities/memos.entity';
import { Tag } from '../../entities/tags.entity';
import { MemoService } from './memo.service';
import { MemoController } from './memo.controller';
import { User } from '../../entities/user.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Memo, Category, Tag, User])],
  controllers: [MemoController],
  providers: [MemoService, UserService],
  exports: [MemoService],
})
export class MemoModule {}
