import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(userDetail: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDetail.email);
    if (user) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Email already exists',
      });
    }
    // console.log(userDetail);
    return await this.userService.createUser(userDetail);
  }
}
