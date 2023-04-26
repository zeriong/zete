import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemoService } from './memo.service';
import { CoreOutput } from '../../common/dtos/coreOutput.dto';
import { CreateMemoInputDto, CreateMemoOutDto } from './dtos/memo.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import {
  CreateCateInputDto,
  CreateCateOutputDto, UpdateManyCateInputDto, CateInputDto, CateIdInputDto
} from './dtos/cate.dto';
import { SendContentDataOutputDto } from './dtos/sendContentData.dto';

@Controller('memo')
@ApiTags('Memo') //스웨거 Tag를 지정
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @ApiResponse({ type: CreateMemoOutDto })
  @UseGuards(JwtAuthGuard)
  @Post('createMemo')
  createMemo(
    @Req() req,
    @Body() input: CreateMemoInputDto,
  ): Promise<CreateMemoOutDto> {
    return this.memoService.createMemo(input, req.user);
  }

  @ApiResponse({ type: CreateCateOutputDto })
  @UseGuards(JwtAuthGuard)
  @Post('createCate')
  createCate(
    @Req() req,
    @Body() input: CreateCateInputDto,
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
  updateOneCate(@Body() input: CateInputDto): Promise<CoreOutput> {
    return this.memoService.updateOneCate(input);
  }
  @ApiResponse({ type: CoreOutput })
  @Post('updateManyCate')
  updateManyCate(@Body() input: UpdateManyCateInputDto): Promise<CoreOutput> {
    return this.memoService.updateManyCate(input);
  }

  @ApiResponse({ type: CoreOutput })
  @Delete()
  deleteCate(@Body() input: CateIdInputDto): Promise<CoreOutput> {
    return this.memoService.deleteCate(input);
  }
}
