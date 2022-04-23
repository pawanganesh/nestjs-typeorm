import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Pawanlal' })
  readonly firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Pawanlal' })
  readonly middleName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Pawanlal' })
  readonly lastName: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @ApiProperty({ minLength: 8, example: 'Secret@123' })
  readonly password: string;
}
