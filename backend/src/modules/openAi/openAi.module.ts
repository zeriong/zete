import { Module } from '@nestjs/common';
import { OpenAiService } from './openAi.service';
import { OpenAiController } from './openAi.controller';

@Module({
  controllers: [OpenAiController],
  providers: [OpenAiService],
})
export class OpenAiModule {}
