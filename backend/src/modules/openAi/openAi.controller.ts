import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCompletionResponse } from 'openai';
import { OpenAiService } from './openAi.service';
import { CreateCompletionInputDto } from './dto/createCompletionInputDto';

@ApiTags('OpenAi')
@Controller('openAi')
export class OpenAiController {
  constructor(private readonly aiService: OpenAiService) {}

  @ApiResponse({ type: Promise<CreateCompletionResponse> })
  @Post('createCompletion')
  async createCompletion(
    @Body() createCompletionDto: CreateCompletionInputDto,
  ): Promise<CreateCompletionResponse> {
    return this.aiService.createCompletion(createCompletionDto);
  }
}
