import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  user = 'USER',
  admin = 'ADMIN',
  superAdmin = 'SUPER_ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({
    nullable: true,
  })
  middleName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.user,
  })
  role: UserRole;

  @Column({ default: false })
  isVerified: boolean;

  @Column({
    default: false,
  })
  passwordResetRequested: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
