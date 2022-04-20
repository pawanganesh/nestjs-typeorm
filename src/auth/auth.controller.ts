import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserDto } from 'src/user/dto/user.dt';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize(UserDto)
  @Post('register')
  async register(@Body() input: CreateUserDto) {
    return await this.authService.register(input);
  }
}
