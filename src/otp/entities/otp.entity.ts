import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum OTPType {
  emailVerification = 'EMAIL_VERIFICATION',
  passwordReset = 'PASSWORD_RESET',
  other = 'OTHER',
}

@Entity()
export class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 6,
  })
  code: string;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.otps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: OTPType,
    default: OTPType.other,
  })
  type: OTPType;

  @CreateDateColumn()
  createdAt: Date;
}
