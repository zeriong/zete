import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import {
  CreateCompletionDto,
  CreateCompletionOutputDto,
} from './dto/createCompletionDto';
import { User } from '../../entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class OpenAiService {
  private openAiApi: OpenAIApi;

  constructor(private readonly userService: UserService) {
    const configuration = new Configuration({
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openAiApi = new OpenAIApi(configuration);
  }

  async createCompletion(
    input: CreateCompletionDto,
    user: User,
  ): Promise<CreateCompletionOutputDto> {
    try {
      if (user.gptDailyLimit === 0) {
        return { success: true, message: '질문 가능한 횟수를 초과하였습니다' };
      }

      // gpt 3.5 turbo 요청
      const response = await this.openAiApi.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: input.content,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      // 요청성공시 available감소 후 적용
      user.gptDailyLimit--;
      await this.userService.saveUser(user);

      return {
        gptResponse: response.data.choices[0].message.content,
        gptDailyLimit: user.gptDailyLimit,
        success: true,
      };
    } catch (e) {
      return {
        success: false,
        error: 'Chat-GPT 서버에 접속할 수 없습니다.',
      };
    }
  }
}
