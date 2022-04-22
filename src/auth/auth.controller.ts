import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/@guards/local.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserDto } from 'src/user/dto/user.dt';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize(UserDto)
  @Post('register')
  async register(@Body() input: CreateUserDto) {
    return await this.authService.register(input);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Request() req: any) {
    return await this.authService.login(req.user);
  }
}
