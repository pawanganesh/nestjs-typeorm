import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserService } from 'src/user/user.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(userDetail: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDetail.email);
    if (user) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Email already exists',
      });
    }
    return await this.userService.createUser(userDetail);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByEmailWithPassword(email);

    if (!user)
      throw new UnauthorizedException({
        statusCode: 404,
        message: 'User is not yet registered',
      });

    const valid = await argon.verify(user.password, password);
    if (!valid)
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Invalid email or password',
      });

    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
