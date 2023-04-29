import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemoService } from './memo.service';
import { CoreOutput } from '../../common/dtos/coreOutput.dto';
import { CreateMemoInputDto, CreateMemoOutputDto, PaginationInputDto, PaginationOutputDto } from './dtos/memo.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import {
  CreateCateInputDto,
  CreateCateOutputDto,
  UpdateManyCateInputDto,
  CateInputDto,
  CateIdInputDto, DeleteCateOutputDto
} from './dtos/cate.dto';
import { SendDefaultDataOutputDto } from './dtos/sendContentData.dto';

@Controller('memo')
@ApiTags('Memo') //스웨거 Tag를 지정
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @ApiResponse({ type: CreateMemoOutputDto })
  @UseGuards(JwtAuthGuard)
  @Post('createMemo')
  createMemo(
    @Req() req,
    @Body() input: CreateMemoInputDto,
  ): Promise<CreateMemoOutputDto> {
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

  @ApiResponse({ type: SendDefaultDataOutputDto })
  @UseGuards(JwtAuthGuard)
  @Post('sendContentData')
  sendDefaultData(@Req() req): Promise<SendDefaultDataOutputDto> {
    return this.memoService.sendDefaultData(req.user);
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

  @ApiResponse({ type: DeleteCateOutputDto })
  @Delete()
  deleteCate(@Body() input: CateIdInputDto): Promise<DeleteCateOutputDto> {
    return this.memoService.deleteCate(input);
  }

  @ApiResponse({ type: PaginationOutputDto })
  @UseGuards(JwtAuthGuard)
  @Post('scrollPagination')
  scrollPagination(
    @Body() input: PaginationInputDto,
    @Req() req,
  ): Promise<PaginationOutputDto> {
    return this.memoService.scrollPagination(input, req.user);
  }
}
