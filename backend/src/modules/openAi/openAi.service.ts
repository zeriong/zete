import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import {
  CreateCompletionInputDto,
  CreateCompletionOutputDto,
} from './dto/createCompletionInputDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OpenAiService {
  private openAiApi: OpenAIApi;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const configuration = new Configuration({
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openAiApi = new OpenAIApi(configuration);
  }

  async createCompletion(
    input: CreateCompletionInputDto,
    user: User,
  ): Promise<CreateCompletionOutputDto> {
    try {
      const findUser = await this.userRepository.findOne({
        where: { id: user.id },
      });

      if (!findUser) {
        return { success: false, error: '존재하지 않는 유저입니다.' };
      }

      if (findUser.gptAvailable === 0) {
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
      findUser.gptAvailable--;
      await this.userRepository.save(findUser);

      return {
        resGpt: response.data.choices[0].message.content,
        gptAvailable: findUser.gptAvailable,
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
