import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/@guards/jwt.guard';
import { RolesGuard } from 'src/@guards/roles.guard';
import { GetUser } from 'src/decorators/getUser.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { EditUserDto } from './dto/editUser.dto';
import { UserDto } from './dto/user.dt';
import { User, UserRole } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  @Get('me')
  async getCurrentUser(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.superAdmin, UserRole.admin)
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
