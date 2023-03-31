import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCompletionResponse } from 'openai';
import { OpenAiService } from './openAi.service';
import { CreateCompletionDto } from './dto/createCompletion.dto';

@ApiTags('OpenAi')
@Controller('openAi')
export class OpenAiController {
  constructor(private readonly aiService: OpenAiService) {}

  @ApiResponse({ type: Promise<CreateCompletionResponse> })
  @Post()
  async createCompletion(
    @Body() createCompletionDto: CreateCompletionDto,
  ): Promise<CreateCompletionResponse> {
    return this.aiService.createCompletion(createCompletionDto);
  }
}
