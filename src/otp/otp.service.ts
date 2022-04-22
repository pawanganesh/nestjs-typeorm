import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { OTP, OTPType } from './entities/otp.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
  ) {}

  createOtp(user: User) {
    const otp = new OTP();

    // TODO:: Generate random 6 digit numeric OTP code
    otp.code = '123456';
    otp.type = OTPType.passwordReset;
    otp.user = user;

    return this.otpRepository.save(otp);
  }

  async validateOtp(user: User, code: string, type: OTPType) {
    // OTP is valid for 15 minutes only
    const expiryTime = 1000 * 60 * 15;

    const otp = await this.otpRepository.findOne({
      where: { userId: user.id, code, type },
    });
    console.log(otp);
    if (!otp) throw new BadRequestException('Invalid OTP');

    if (otp.createdAt.getTime() + expiryTime < Date.now()) {
      throw new BadRequestException('OTP has expired!');
    }

    return true;
  }
}
