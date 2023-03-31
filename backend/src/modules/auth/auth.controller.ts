import { LoginInput, LoginOutput } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { AccessTokenOutput } from './dtos/token.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CoreOutput } from '../../common/dtos/coreOutput.dto';
import { Response } from 'express';
import { JwtRefreshAuthGuard } from './guards/jwtRefreshAuth.guard';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth') //스웨거 Tag를 지정
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** 로그인 */
  @ApiResponse({ type: LoginOutput })
  @Post('login')
  async login(
    @Body() input: LoginInput,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginOutput> {
    return this.authService.login(input, response);
  }

  /** 토큰 리프래쉬 */
  @ApiResponse({ type: AccessTokenOutput })
  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@Req() req): Promise<AccessTokenOutput> {
    return this.authService.refreshToken(req.user, req);
  }

  /** 로그아웃 */
  @ApiResponse({ type: CoreOutput })
  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CoreOutput> {
    console.log('logout: 접근');
    return this.authService.logout(req.user, res);
  }
}
