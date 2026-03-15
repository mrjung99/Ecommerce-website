import { Role } from 'src/auth/enum/role.enum';
import { Profile } from 'src/profile/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    enumName: 'user_role',
    default: Role.USER,
  })
  role: Role;

  @Column({
    type: 'text',
    nullable: true,
  })
  hashedRefreshToken: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    eager: true,
    cascade: ['insert', 'remove'],
  })
  @JoinColumn()
  profile: Profile;
}
