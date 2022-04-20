import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'Pawanlal' })
  readonly firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Pawanlal' })
  readonly middleName: string;

  @IsString()
  @ApiProperty({ example: 'Pawanlal' })
  readonly lastName: string;

  @IsEmail()
  @ApiProperty({ example: 'pawanlalganesh@gmail.com' })
  readonly email: string;

  @IsString()
  @ApiProperty({ example: '+977-9824902116' })
  readonly phone: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ minLength: 8, example: 'Secret@123' })
  readonly password: string;
}
