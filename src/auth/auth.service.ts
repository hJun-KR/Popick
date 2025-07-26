import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { id, password } = loginDto;

    const user = await this.userService.findByIdForAuth(id);
    if (!user) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 잘못되었습니다.');
    }

    const isPasswordValid = await this.userService.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 잘못되었습니다.');
    }

    const payload = { sub: user.idx, id: user.id, nickname: user.nickname };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        idx: user.idx,
        id: user.id,
        nickname: user.nickname,
      },
    };
  }

  async validateUser(payload: any) {
    const user = await this.userService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
