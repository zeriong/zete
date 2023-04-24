import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemoService } from './memo.service';
import { CoreOutput } from '../../common/dtos/coreOutput.dto';
import { CreateMemoInputDto } from './dtos/memo.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import {
  CreateCateDto,
  CreateCateOutputDto, UpdateManyCateInputDto, UpdateOneCateInputDto
} from './dtos/cate.dto';
import { SendContentDataOutputDto } from './dtos/sendContentData.dto';

@Controller('memo')
@ApiTags('Memo') //스웨거 Tag를 지정
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @ApiResponse({ type: CoreOutput })
  @UseGuards(JwtAuthGuard)
  @Post('createMemo')
  createMemo(
    @Req() req,
    @Body() input: CreateMemoInputDto,
  ): Promise<CoreOutput> {
    return this.memoService.createMemo(input, req.user);
  }

  @ApiResponse({ type: CreateCateOutputDto })
  @UseGuards(JwtAuthGuard)
  @Post('createCate')
  createCate(
    @Req() req,
    @Body() input: CreateCateDto,
  ): Promise<CreateCateOutputDto> {
    return this.memoService.createCate(input, req.user);
  }

  @ApiResponse({ type: SendContentDataOutputDto })
  @UseGuards(JwtAuthGuard)
  @Post('sendContentData')
  sendContentData(@Req() req): Promise<SendContentDataOutputDto> {
    return this.memoService.sendContentData(req.user);
  }

  @ApiResponse({ type: CoreOutput })
  @Post('updateOneCate')
  updateOneCate(@Body() input: UpdateOneCateInputDto): Promise<CoreOutput> {
    return this.memoService.updateOneCate(input);
  }
  @ApiResponse({ type: CoreOutput })
  @Post('updateManyCate')
  updateManyCate(@Body() input: UpdateManyCateInputDto): Promise<CoreOutput> {
    return this.memoService.updateManyCate(input);
  }
}
