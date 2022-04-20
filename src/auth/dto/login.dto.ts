import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'pawanlalganesh@gmail.com' })
  readonly email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ minLength: 8, example: 'Secret@123' })
  readonly password: string;
}
