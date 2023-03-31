import { Injectable } from '@nestjs/common';
import {
  Configuration,
  CreateCompletionRequest,
  CreateCompletionResponse,
  OpenAIApi,
} from 'openai';
import { CreateCompletionDto } from './dto/createCompletion.dto';

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

  async createCompletion({
    question,
    model,
    temperature,
  }: CreateCompletionDto): Promise<CreateCompletionResponse> {
    try {
      /*const params: CreateCompletionRequest = {
        prompt: question,
        model: model || 'gpt-3.5-turbo' //'text-davinci-003',
        temperature: temperature || 0,
      };

      console.log('createCompletion!!!!!!!!!!');
*/
      const response = await this.openAiApi.createChatCompletion({
        model: 'gpt-3.5-turbo', //'text-davinci-003',
        messages: [
          {
            role: 'user',
            content: '20글자로 문장 만들어줘',
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      });

      //const response = await this.openAiApi.listModels();
      console.log(response.data?.choices[0]['message'].content);

      return null; //data;
    } catch (e) {
      throw new Error(e);
    }
  }
}
