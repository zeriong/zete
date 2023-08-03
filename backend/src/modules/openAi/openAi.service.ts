import { Injectable, Logger } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import {
  CreateCompletionDto,
  CreateCompletionOutputDto,
} from './dto/createCompletion.dto';
import { User } from '../../entities/user.entity';
import { UserService } from '../user/user.service';
import { MemoService } from '../memo/memo.service';

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(MemoService.name);
  private openAiApi: OpenAIApi;

  constructor(private readonly userService: UserService) {
    const configuration = new Configuration({
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openAiApi = new OpenAIApi(configuration);
  }

  /** openAi gpt 채팅 생성
   * @return 결과 메세지, 남은 횟수
   * */
  async createCompletion(input: CreateCompletionDto, user: User): Promise<CreateCompletionOutputDto> {
    try {
      if (user.gptUsableCount === 0) {
        return { success: true, message: '질문 가능한 횟수를 초과하였습니다' };
      }

      // gpt 3.5 turbo 요청
      const response = await this.openAiApi.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: input.content }],
        temperature: 0.3,
        max_tokens: 1000,
      });

      // 요청성공시 사용 가능 횟수 차감
      const res = await this.userService.update(user.id, { gptUsableCount: user.gptUsableCount - 1 });

      if (res) {
        return {
          gptResponse: response.data.choices[0].message.content,
          usableCount: user.gptUsableCount,
          success: true,
        };
      }
    } catch (e) {
      this.logger.error(e);
    }

    return { success: false, error: 'Chat-GPT 서버에 접속할 수 없습니다.' };
  }
}
