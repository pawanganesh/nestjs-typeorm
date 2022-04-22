import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserDto } from 'src/user/dto/user.dt';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  FinalizeResetPasswordDto,
  InitiateResetPasswordDto,
} from './dto/resetPassword.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize(UserDto)
  @Post('register')
  async register(@Body() input: CreateUserDto) {
    return await this.authService.register(input);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() input: LoginDto) {
    return await this.authService.login(input);
  }

  @Post('reset-password')
  async ResetPassword(@Body() input: InitiateResetPasswordDto) {
    return this.authService.initiateResetPassword(input.email);
  }

  @Patch('reset-password')
  async ResetPasswordOTP(@Body() input: FinalizeResetPasswordDto) {
    return this.authService.finalizeResetPassword(
      input.email,
      input.code,
      input.password,
    );
  }
}
