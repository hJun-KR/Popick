import { Controller, Post, Body, UseGuards, Get, Request, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto, LoginDto } from '../user/dto/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return {
      message: '회원가입이 완료되었습니다.',
      user,
    };
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      message: '로그인된 사용자 정보입니다.',
      user: req.user,
    };
  }

  @Get('dev/users')
  getAllUsers() {
    return {
      message: '모든 사용자 목록 (개발용)',
      users: this.userService.getAllUsers(),
      total: this.userService.getUserCount(),
    };
  }

  @Get('dev/status')
  getStatus() {
    return {
      message: 'MVP 인증 서버 상태',
      status: 'running',
      userCount: this.userService.getUserCount(),
      timestamp: new Date(),
    };
  }
}
