import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/@guards/jwt.guard';
import { GetUser } from 'src/decorators/getUser.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dt';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Serialize(UserDto)
  @Get('me')
  async getCurrentUser(@GetUser() user: User) {
    return user;
  }
}
