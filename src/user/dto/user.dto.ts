import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
