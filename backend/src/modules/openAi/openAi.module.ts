import { Module } from '@nestjs/common';
import { OpenAiService } from './openAi.service';
import { OpenAiController } from './openAi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [OpenAiController],
  providers: [OpenAiService],
})
export class OpenAiModule {}
