import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserService } from 'src/user/user.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { OtpService } from 'src/otp/otp.service';
import { OTPType } from 'src/otp/entities/otp.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async register(userDetail: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDetail.email);
    if (user) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Email already exists',
      });
    }
    const { ...savedUser } = await this.userService.createUser(userDetail);

    // TODO: send email with OTP
    const otp = await this.otpService.createOtp(
      savedUser.id,
      OTPType.emailVerification,
    );
    // console.log(otp.id);

    return savedUser;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByEmailWithPassword(email);

    if (!user)
      throw new UnauthorizedException({
        statusCode: 404,
        message: 'User is not yet registered',
      });

    if (user.isVerified)
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'User is not yet verified',
      });

    const valid = await argon.verify(user.password, password);
    if (!valid)
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Invalid email or password',
      });

    return user;
  }

  async login(input: LoginDto) {
    const user = await this.validateUser(input.email, input.password);
    const payload = { sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async verifyEmail(email: string, code: string) {
    await this.userService.verifyEmail(email, code);

    return { message: 'Email has been successfully verified!' };
  }

  async initiateResetPassword(email: string) {
    await this.userService.initiateResetPassword(email);

    return { message: 'OTP has been sent to your email!' };
  }

  async finalizeResetPassword(email: string, code: string, password: string) {
    await this.userService.finalizeResetPassword(email, code, password);

    return { message: 'Password has been successfully reset!' };
  }
}
