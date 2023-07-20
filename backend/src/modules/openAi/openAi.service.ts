import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import {
  CreateCompletionInputDto,
  CreateCompletionOutputDto,
} from './dto/createCompletionInputDto';

@Injectable()
export class OpenAiService {
  private openAiApi: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openAiApi = new OpenAIApi(configuration);
  }

  async createCompletion(
    input: CreateCompletionInputDto,
  ): Promise<CreateCompletionOutputDto> {
    try {
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

      return {
        resGpt: response.data.choices[0].message.content,
        success: true,
      };
    } catch (e) {
      return {
        success: false,
        error: 'Chat-GPT 서버에 접속할 수 없습니다.',
        resGpt: '',
      };
    }
  }
}
