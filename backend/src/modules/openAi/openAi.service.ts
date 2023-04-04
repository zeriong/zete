import { Injectable } from '@nestjs/common';
import {
  Configuration,
  CreateCompletionRequest,
  CreateCompletionResponse,
  OpenAIApi,
} from 'openai';
import { CreateCompletionInputDto } from './dto/createCompletionInputDto';

@Injectable()
export class OpenAiService {
  private openAiApi: OpenAIApi;

  constructor() {
    console.log('설치: ', process.env.ORGANIZATION_ID);
    const configuration = new Configuration({
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openAiApi = new OpenAIApi(configuration);
  }

  async createCompletion(
    input: CreateCompletionInputDto,
  ): Promise<CreateCompletionResponse | null> {
    console.log('createCompletion!!!!!!!!!!');
    try {
      // /** 다빈치003 모델 기준 */
      // const params: CreateCompletionRequest = {
      //   // prompt: input.question,
      //   prompt: '반가워 넌 이름이 뭐야?',
      //   model: 'text-davinci-003', //이 경우 gpt-3.5-turbo모델은 불가능
      //   temperature: 0.3,
      //   max_tokens: 3000,
      // };
      // const response = await this.openAiApi.createCompletion(params);
      //
      // console.log(response.data);
      // console.log(response.data.choices[0]);
      // console.log(response.data.choices[0].text);
      // console.log(response.data.choices[1]);

      // /** gpt-3.5-turbo 모델 기준 */
      // const response = await this.openAiApi.createChatCompletion({
      //   model: 'gpt-3.5-turbo',
      //   messages: [
      //     {
      //       role: 'user', // user assistant system
      //       content: input.question,
      //     },
      //   ],
      //   temperature: 0.3,
      //   max_tokens: 1000,
      // });
      // console.log('---------------------------------------');
      // console.log(response.data);
      // console.log(response.data.choices[0]['message']);
      // console.log(response.data.choices[0]['message'].content);
      // console.log(response.data.choices[1]);

      const response = await this.openAiApi.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user', // user assistant system
            content: '멋진동물 3마리만 추천해줘',
          },
          {
            role: 'user', // user assistant system
            content: '그 중에 두번째동물의 특징은 뭐야?',
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      console.log('---------------------------------------');
      console.log(response.data);
      console.log(response.data.choices[0]['message']);
      console.log(response.data.choices[0]['message'].content);
      console.log(response.data.choices);

      return null; //data;
    } catch (e) {
      throw new Error(e);
    }
  }
}
