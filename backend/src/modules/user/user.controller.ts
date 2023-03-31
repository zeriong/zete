import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { CoreOutput } from '../../common/dtos/coreOutput.dto';
import { CreateAccountDto } from './dtos/createAccount.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { UpdateAccountDto } from './dtos/updateAccount.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User') //스웨거 Tag를 지정
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 유저데이터 전체 검색 */
  @ApiResponse({ type: [User] })
  @Get('all')
  getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  /** 유저데이터 생성 */
  @ApiResponse({ type: CoreOutput })
  @Post('register')
  createAccount(@Body() input: CreateAccountDto): Promise<CoreOutput> {
    return this.userService.createAccount(input);
  }

  /** 유저데이터 수정 */
  @ApiResponse({ type: CoreOutput })
  @Patch('modify')
  @UseGuards(JwtAuthGuard)
  profileUpdate(
    @Req() req,
    @Body() updateData: UpdateAccountDto,
  ): Promise<CoreOutput> {
    return this.userService.profileUpdate(req.user, updateData);
  }

  /** 프로필 response */
  @ApiResponse({ type: User })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req): Promise<User> {
    return await this.userService.profile(req.user.id);
  }

  /** id로 유저데이터 삭제 */
  @ApiResponse({ type: CoreOutput })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<CoreOutput> {
    return this.userService.delete(id);
  }

  @ApiResponse({ type: CoreOutput })
  @Post('testApi')
  async testApi(@Body('id') id: number): Promise<CoreOutput> {
    return { success: true, target: `test: ${id}` };
  }
}
