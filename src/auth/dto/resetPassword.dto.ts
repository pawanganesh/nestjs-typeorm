import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiateResetPasswordDto {
  @IsEmail()
  @ApiProperty({ example: 'pawanlalganesh@gmail.com' })
  readonly email: string;
}

export class FinalizeResetPasswordDto {
  @IsEmail()
  @ApiProperty({ example: 'pawanlalganesh@gmail.com' })
  readonly email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  readonly code: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ minLength: 8, example: 'Secret@520' })
  readonly password: string;
}
