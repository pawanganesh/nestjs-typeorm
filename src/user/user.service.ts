import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';
import * as argon from 'argon2';
import { OtpService } from 'src/otp/otp.service';
import { OTPType } from 'src/otp/entities/otp.entity';
import { sendMail } from 'src/helpers/mail';
import { EditUserDto } from './dto/editUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private otpService: OtpService,
  ) {}

  async getUserById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'password'],
    });
  }

  async createUser(user: CreateUserDto) {
    const userInfo = { ...user };
    userInfo.password = await argon.hash(user.password);
    const { password, ...savedUser } = await this.userRepository.save(userInfo);
    return savedUser;
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.getUserByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const isValid = await this.otpService.validateOtp(
      user,
      code,
      OTPType.emailVerification,
    );
    if (!isValid) throw new BadRequestException('Invalid OTP');

    user.isVerified = true;
    await this.userRepository.save(user);
  }

  async initiateResetPassword(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) throw new NotFoundException("User doesn't exist");

    const otp = await this.otpService.createOtp(user.id, OTPType.passwordReset);

    // TODO :: Send email with OTP
    sendMail({
      to: email,
      subject: 'Password Reset',
      text: `Your Password Reset OTP is: ${otp.code}`,
    });

    user.passwordResetRequested = true;
    await this.userRepository.save(user);
  }

  async finalizeResetPassword(email: string, code: string, password: string) {
    const user = await this.getUserByEmail(email);
    if (!user) throw new NotFoundException("User doesn't exist");

    const isValid = await this.otpService.validateOtp(
      user,
      code,
      OTPType.passwordReset,
    );
    if (!isValid) throw new BadRequestException('Invalid OTP');

    user.passwordResetRequested = false;
    user.password = await argon.hash(password);
    await this.userRepository.save(user);
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async editUser(userId: number, input: EditUserDto) {
    const { ...user } = input;
    if (input.password) user.password = await argon.hash(input.password);

    const updatedUser = await this.userRepository
      .createQueryBuilder()
      .update(user)
      .where('id = :id', { id: userId })
      .returning(['firstName', 'middleName', 'lastName', 'email', 'phone'])
      .updateEntity(true)
      .execute();
    return updatedUser.raw[0];
  }
}
