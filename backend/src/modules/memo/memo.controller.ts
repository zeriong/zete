import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemoService } from './memo.service';
import { CoreOutput } from '../../common/dtos/coreOutput.dto';
import {
  CreateMemoOutput,
  MemoIdInput,
  GetMemosInput,
  GetMemosOutput,
  CreateMemoInput,
  UpdateMemoInput,
  GetOneMemoOutput,
} from './dtos/memo.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import {
  CreateCateInput,
  CreateCateOutput,
  CateIdInput,
  ImportantMemoLengthOutput,
  CateInput,
} from './dtos/cate.dto';
import { AsideDataOutput } from './dtos/asideData.dto';

@Controller('memo')
@ApiTags('Memo')
@UseGuards(JwtAuthGuard)
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  /** get data ----------------------------------------------------- */
  @ApiResponse({ type: AsideDataOutput })
  @Get('getAsideData')
  getAsideData(@Req() req): Promise<AsideDataOutput> {
    return this.memoService.getAsideData(req.user);
  }

  @ApiResponse({ type: GetMemosOutput })
  @Patch('get')
  get(@Req() req, @Body() input: GetMemosInput): Promise<GetMemosOutput> {
    return this.memoService.getMemos(input, req.user);
  }

  @ApiResponse({ type: GetOneMemoOutput })
  @Patch('getOne')
  getOne(@Req() req, @Body() input: MemoIdInput): Promise<GetOneMemoOutput> {
    return this.memoService.getOneMemo(input, req.user);
  }

  /** category ----------------------------------------------------- */
  @ApiResponse({ type: CreateCateOutput })
  @Post('createCategory')
  createCategory(
    @Req() req,
    @Body() input: CreateCateInput,
  ): Promise<CreateCateOutput> {
    return this.memoService.createCategory(input, req.user);
  }

  @ApiResponse({ type: CoreOutput })
  @Patch('updateOneCate')
  updateCategory(@Req() req, @Body() input: CateInput): Promise<CoreOutput> {
    return this.memoService.updateCategory(input, req.user);
  }

  @ApiResponse({ type: ImportantMemoLengthOutput })
  @Delete('deleteCategory')
  deleteCategory(
    @Req() req,
    @Body() input: CateIdInput,
  ): Promise<ImportantMemoLengthOutput> {
    return this.memoService.deleteCategory(input, req.user);
  }

  /** memo ----------------------------------------------------- */
  @ApiResponse({ type: CreateMemoOutput })
  @Post('createMemo')
  createMemo(
    @Req() req,
    @Body() input: CreateMemoInput,
  ): Promise<CreateMemoOutput> {
    return this.memoService.createMemo(input, req.user);
  }

  @ApiResponse({ type: CoreOutput })
  @Patch('updateMemo')
  updateMemo(@Req() req, @Body() input: UpdateMemoInput): Promise<CoreOutput> {
    return this.memoService.updateMemo(input, req.user);
  }

  @ApiResponse({ type: CoreOutput })
  @Delete('deleteMemo')
  deleteMemo(@Req() req, @Body() input: MemoIdInput) {
    return this.memoService.deleteMemo(input, req.user);
  }

  @ApiResponse({ type: ImportantMemoLengthOutput })
  @Patch('changeImportant')
  changeImportant(
    @Req() req,
    @Body() input: MemoIdInput,
  ): Promise<ImportantMemoLengthOutput> {
    return this.memoService.changeImportant(input, req.user);
  }
}
