import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class EmailVerificationDto {
  @IsEmail()
  @ApiProperty({ example: 'pawanlalganesh@gmail.com' })
  readonly email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @ApiProperty({ example: '123456' })
  readonly code: string;
}
