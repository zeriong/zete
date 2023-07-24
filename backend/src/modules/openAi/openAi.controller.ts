import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OpenAiService } from './openAi.service';
import {
  CreateCompletionDto,
  CreateCompletionOutputDto,
} from './dto/createCompletionDto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

@ApiTags('OpenAi')
@Controller('openAi')
export class OpenAiController {
  constructor(private readonly aiService: OpenAiService) {}

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: CreateCompletionOutputDto })
  @Post('createCompletion')
  async createCompletion(
    @Body() input: CreateCompletionDto,
    @Req() req,
  ): Promise<CreateCompletionOutputDto> {
    return this.aiService.createCompletion(input, req.user);
  }
}
