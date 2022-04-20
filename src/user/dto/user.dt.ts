import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  firstName: string;

  @Expose()
  middleName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;
}
