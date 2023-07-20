import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OpenAiService } from './openAi.service';
import {
  CreateCompletionInputDto,
  CreateCompletionOutputDto,
} from './dto/createCompletionInputDto';

@ApiTags('OpenAi')
@Controller('openAi')
export class OpenAiController {
  constructor(private readonly aiService: OpenAiService) {}

  @ApiResponse({ type: CreateCompletionOutputDto })
  @Post('createCompletion')
  async createCompletion(
    @Body() input: CreateCompletionInputDto,
  ): Promise<CreateCompletionOutputDto> {
    return this.aiService.createCompletion(input);
  }
}
